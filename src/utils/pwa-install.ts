
// Utility for handling PWA installation

// Store for the deferred prompt event
let deferredPrompt: BeforeInstallPromptEvent | null = null;

// Interface for the BeforeInstallPromptEvent which isn't in the standard lib
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

// Check if the app is already installed
export const isPWAInstalled = (): boolean => {
  // Check if in standalone mode or installed through native methods
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone === true;
};

// Check if the app has been prompted before
export const hasBeenPrompted = (): boolean => {
  return localStorage.getItem('pwaPromptShown') === 'true';
};

// Set the app as prompted
export const setAsPrompted = (): void => {
  localStorage.setItem('pwaPromptShown', 'true');
};

// Initialize the install prompt listener
export const initInstallPrompt = (setShowBanner: (show: boolean) => void): () => void => {
  // Skip if already installed or previously prompted
  if (isPWAInstalled() || hasBeenPrompted()) {
    return () => {};
  }

  const handleBeforeInstallPrompt = (e: Event) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Store the event for later use
    deferredPrompt = e as BeforeInstallPromptEvent;
    // Show the custom install banner
    setShowBanner(true);
    
    console.log('Install prompt ready');
  };

  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  };
};

// Trigger the install prompt
export const triggerInstallPrompt = async (): Promise<'accepted' | 'dismissed' | 'failed'> => {
  if (!deferredPrompt) {
    console.log('No install prompt available');
    return 'failed';
  }

  // Show the install prompt
  deferredPrompt.prompt();

  // Wait for the user to respond to the prompt
  const choiceResult = await deferredPrompt.userChoice;
  
  // Clear the saved prompt
  deferredPrompt = null;
  
  // Mark as prompted in localStorage
  setAsPrompted();
  
  // Return the outcome
  return choiceResult.outcome;
};
