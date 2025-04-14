
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
  id: string;
  name?: string;
  email?: string;
  status?: boolean;
  avatar?: string;
  role?: string;
  last_active?: string;
}

interface UserListProps {
  users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="divide-y">
      {users.length === 0 ? (
        <div className="py-4 text-center text-muted-foreground">
          Nenhum usuário encontrado
        </div>
      ) : (
        users.map((user) => (
          <div key={user.id} className="flex items-center py-3 px-4 hover:bg-muted/50">
            <Avatar className="h-9 w-9 mr-3">
              <AvatarImage src={user.avatar} alt={user.name || "User"} />
              <AvatarFallback>{getInitials(user.name || "User")}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name || "Usuário"}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email || ""}</p>
            </div>
            <Badge variant={user.status ? "default" : "outline"} className="ml-2">
              {user.status ? "Ativo" : "Inativo"}
            </Badge>
          </div>
        ))
      )}
    </div>
  );
};

export default UserList;
