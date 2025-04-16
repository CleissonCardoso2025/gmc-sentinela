
import { supabase } from '@/integrations/supabase/client';
import { PageAccess } from '@/components/Configuracoes/PageAccessControl';

// Fetch all page access settings from Supabase
export const fetchPageAccess = async (): Promise<PageAccess[]> => {
  // First get all distinct pages from the database
  const { data: pageEntries, error: pagesError } = await supabase
    .from('page_access')
    .select('page_name')
    .order('page_name');
    
  // Get unique page names
  const uniquePageNames = pageEntries ? 
    Array.from(new Set(pageEntries.map(entry => entry.page_name))) : 
    [];
    
  if (pagesError) {
    console.error('Error fetching page names:', pagesError);
    throw pagesError;
  }
  
  // Get all distinct roles from the database
  const { data: roleEntries, error: rolesError } = await supabase
    .from('page_access')
    .select('role')
    .order('role');
    
  // Get unique roles
  const uniqueRoles = roleEntries ? 
    Array.from(new Set(roleEntries.map(entry => entry.role))) : 
    [];
    
  if (rolesError) {
    console.error('Error fetching roles:', rolesError);
    throw rolesError;
  }
  
  // Get all access entries from the database
  const { data: accessEntries, error: accessError } = await supabase
    .from('page_access')
    .select('page_name, role, can_access');
    
  if (accessError) {
    console.error('Error fetching access entries:', accessError);
    throw accessError;
  }
  
  // Build the PageAccess objects
  const pageAccessList: PageAccess[] = uniquePageNames.map(pageName => {
    const pageId = pageName.toLowerCase().replace(/\s+/g, '-');
    
    const allowedProfiles = accessEntries
      .filter(entry => entry.page_name === pageName && entry.can_access)
      .map(entry => entry.role);
      
    return {
      id: pageId,
      name: pageName,
      path: `/${pageId}`,
      allowedProfiles
    };
  });
  
  return pageAccessList;
};

// Toggle access for a specific role and page
export const togglePageAccess = async (
  pageId: string, 
  pageName: string,
  role: string, 
  hasAccess: boolean
): Promise<boolean> => {
  try {
    // Upsert the record (insert or update)
    const { error } = await supabase
      .from('page_access')
      .upsert(
        {
          page_name: pageName,
          role: role,
          can_access: hasAccess
        },
        { 
          onConflict: 'page_name,role',
          ignoreDuplicates: false 
        }
      );
      
    if (error) {
      console.error('Error updating page access:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in togglePageAccess:', error);
    return false;
  }
};

// Save multiple page access settings at once
export const savePageAccessSettings = async (pages: PageAccess[]): Promise<boolean> => {
  try {
    // Create a batch of upsert operations
    const upsertData = [];
    
    // For each page, process all the roles and their access status
    for (const page of pages) {
      // Get all available roles from the first page (assuming all pages have the same roles)
      const roles = await getAllRoles();
      
      // For each role, determine if it has access to this page
      for (const role of roles) {
        const hasAccess = page.allowedProfiles.includes(role);
        
        upsertData.push({
          page_name: page.name,
          role: role,
          can_access: hasAccess
        });
      }
    }
    
    // Perform the batch upsert
    const { error } = await supabase
      .from('page_access')
      .upsert(upsertData, {
        onConflict: 'page_name,role',
        ignoreDuplicates: false
      });
      
    if (error) {
      console.error('Error updating page access settings:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in savePageAccessSettings:', error);
    return false;
  }
};

// Get all unique roles from the database
export const getAllRoles = async (): Promise<string[]> => {
  try {
    // First try to get roles using the RPC function
    const { data: authRoles, error: authRolesError } = await supabase
      .rpc('get_all_user_roles');
      
    if (!authRolesError && authRoles && authRoles.length > 0) {
      // If we got roles from the RPC, return them
      return [...new Set(authRoles)].sort();
    }
    
    if (authRolesError) {
      console.error('Error fetching roles from RPC:', authRolesError);
    }
    
    // If RPC fails or returns no data, fall back to querying tables
    
    // First try to get from the page_access table
    const { data: pageAccessRoles, error: pageAccessError } = await supabase
      .from('page_access')
      .select('role')
      .order('role');
      
    // Get unique roles
    const uniquePageAccessRoles = pageAccessRoles ? 
      Array.from(new Set(pageAccessRoles.map(entry => entry.role))) : 
      [];
      
    if (pageAccessError) {
      console.error('Error fetching roles from page_access:', pageAccessError);
    }
    
    // Then get roles from the users table
    const { data: userRoles, error: userRolesError } = await supabase
      .from('users')
      .select('perfil')
      .order('perfil');
      
    // Get unique roles
    const uniqueUserRoles = userRoles ? 
      Array.from(new Set(userRoles.map(u => u.perfil))) : 
      [];
      
    if (userRolesError) {
      console.error('Error fetching roles from users:', userRolesError);
    }
    
    // Combine all roles and remove duplicates
    const allRoles = [
      ...(uniquePageAccessRoles || []),
      ...(uniqueUserRoles || []),
      ...(authRoles || [])
    ];
    
    // Remove duplicates and return
    return [...new Set(allRoles)].sort();
  } catch (error) {
    console.error('Error in getAllRoles:', error);
    return ['Inspetor', 'Subinspetor', 'Supervisor', 'Corregedor', 'Agente', 'Motorista', 'Monitor'];
  }
};
