export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      escala_items: {
        Row: {
          agent: string
          created_at: string | null
          guarnicao: string
          id: string
          periodo: string
          role: string
          rota: string
          schedule: Json
          supervisor: string
          updated_at: string | null
          viatura: string
        }
        Insert: {
          agent: string
          created_at?: string | null
          guarnicao: string
          id?: string
          periodo: string
          role: string
          rota: string
          schedule: Json
          supervisor: string
          updated_at?: string | null
          viatura: string
        }
        Update: {
          agent?: string
          created_at?: string | null
          guarnicao?: string
          id?: string
          periodo?: string
          role?: string
          rota?: string
          schedule?: Json
          supervisor?: string
          updated_at?: string | null
          viatura?: string
        }
        Relationships: []
      }
      guarnicoes: {
        Row: {
          created_at: string | null
          id: string
          nome: string
          supervisor: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          nome: string
          supervisor: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          nome?: string
          supervisor?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      investigacoes: {
        Row: {
          created_at: string | null
          dataabertura: string
          etapaatual: string
          id: string
          investigado: string
          motivo: string
          numero: string
          relatoinicial: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dataabertura: string
          etapaatual: string
          id?: string
          investigado: string
          motivo: string
          numero: string
          relatoinicial?: string | null
          status: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dataabertura?: string
          etapaatual?: string
          id?: string
          investigado?: string
          motivo?: string
          numero?: string
          relatoinicial?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      membros_guarnicao: {
        Row: {
          created_at: string | null
          funcao: string
          guarnicao_id: string | null
          id: string
          nome: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          funcao: string
          guarnicao_id?: string | null
          id?: string
          nome: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          funcao?: string
          guarnicao_id?: string | null
          id?: string
          nome?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "membros_guarnicao_guarnicao_id_fkey"
            columns: ["guarnicao_id"]
            isOneToOne: false
            referencedRelation: "guarnicoes"
            referencedColumns: ["id"]
          },
        ]
      }
      ocorrencias: {
        Row: {
          attachments: Json | null
          created_at: string | null
          data: string
          descricao: string
          id: string
          local: string
          numero: string
          status: string
          tipo: string
          updated_at: string | null
        }
        Insert: {
          attachments?: Json | null
          created_at?: string | null
          data: string
          descricao: string
          id?: string
          local: string
          numero: string
          status: string
          tipo: string
          updated_at?: string | null
        }
        Update: {
          attachments?: Json | null
          created_at?: string | null
          data?: string
          descricao?: string
          id?: string
          local?: string
          numero?: string
          status?: string
          tipo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      rotas: {
        Row: {
          bairros: string | null
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
          pontofinal: string | null
          pontoinicial: string | null
          prioridade: string | null
          tempoprevisto: string | null
          ultimopatrulhamento: string | null
          updated_at: string | null
        }
        Insert: {
          bairros?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
          pontofinal?: string | null
          pontoinicial?: string | null
          prioridade?: string | null
          tempoprevisto?: string | null
          ultimopatrulhamento?: string | null
          updated_at?: string | null
        }
        Update: {
          bairros?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          pontofinal?: string | null
          pontoinicial?: string | null
          prioridade?: string | null
          tempoprevisto?: string | null
          ultimopatrulhamento?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          data_nascimento: string | null
          email: string
          id: string
          matricula: string | null
          nome: string
          perfil: string
          status: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_nascimento?: string | null
          email: string
          id?: string
          matricula?: string | null
          nome: string
          perfil: string
          status?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_nascimento?: string | null
          email?: string
          id?: string
          matricula?: string | null
          nome?: string
          perfil?: string
          status?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vehicle_locations: {
        Row: {
          accuracy: number | null
          id: string
          latitude: number
          location_name: string | null
          longitude: number
          recorded_at: string
          user_id: string | null
          vehicle_id: number
        }
        Insert: {
          accuracy?: number | null
          id?: string
          latitude: number
          location_name?: string | null
          longitude: number
          recorded_at?: string
          user_id?: string | null
          vehicle_id: number
        }
        Update: {
          accuracy?: number | null
          id?: string
          latitude?: number
          location_name?: string | null
          longitude?: number
          recorded_at?: string
          user_id?: string | null
          vehicle_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_locations_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          ano: string | null
          id: number
          marca: string
          modelo: string
          observacoes: string | null
          placa: string
          proximamanutencao: string | null
          quilometragem: number | null
          status: string | null
          tipo: string | null
          ultimamanutencao: string | null
        }
        Insert: {
          ano?: string | null
          id?: number
          marca: string
          modelo: string
          observacoes?: string | null
          placa: string
          proximamanutencao?: string | null
          quilometragem?: number | null
          status?: string | null
          tipo?: string | null
          ultimamanutencao?: string | null
        }
        Update: {
          ano?: string | null
          id?: number
          marca?: string
          modelo?: string
          observacoes?: string | null
          placa?: string
          proximamanutencao?: string | null
          quilometragem?: number | null
          status?: string | null
          tipo?: string | null
          ultimamanutencao?: string | null
        }
        Relationships: []
      }
      viaturas: {
        Row: {
          codigo: string
          created_at: string | null
          id: string
          modelo: string
          updated_at: string | null
        }
        Insert: {
          codigo: string
          created_at?: string | null
          id?: string
          modelo: string
          updated_at?: string | null
        }
        Update: {
          codigo?: string
          created_at?: string | null
          id?: string
          modelo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_latest_vehicle_locations: {
        Args: Record<PropertyKey, never>
        Returns: {
          vehicle_id: number
          latitude: number
          longitude: number
          recorded_at: string
          location_name: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
