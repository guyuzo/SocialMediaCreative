export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      criativos: {
        Row: {
          created_at: string
          data_publicacao: string | null
          formato: Database["public"]["Enums"]["criativo_formato"]
          id: string
          ideia_id: string | null
          status: Database["public"]["Enums"]["criativo_status"]
          tema_id: string
          titulo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_publicacao?: string | null
          formato: Database["public"]["Enums"]["criativo_formato"]
          id?: string
          ideia_id?: string | null
          status?: Database["public"]["Enums"]["criativo_status"]
          tema_id: string
          titulo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_publicacao?: string | null
          formato?: Database["public"]["Enums"]["criativo_formato"]
          id?: string
          ideia_id?: string | null
          status?: Database["public"]["Enums"]["criativo_status"]
          tema_id?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "criativos_ideia_id_fkey"
            columns: ["ideia_id"]
            isOneToOne: false
            referencedRelation: "ideias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "criativos_tema_id_fkey"
            columns: ["tema_id"]
            isOneToOne: false
            referencedRelation: "temas"
            referencedColumns: ["id"]
          },
        ]
      }
      ideias: {
        Row: {
          created_at: string
          id: string
          promovida: boolean
          resumo: string
          tema_id: string
          titulo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          promovida?: boolean
          resumo?: string
          tema_id: string
          titulo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          promovida?: boolean
          resumo?: string
          tema_id?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ideias_tema_id_fkey"
            columns: ["tema_id"]
            isOneToOne: false
            referencedRelation: "temas"
            referencedColumns: ["id"]
          },
        ]
      }
      referencias: {
        Row: {
          conteudo: string
          created_at: string
          id: string
          tema_id: string
          tipo: Database["public"]["Enums"]["referencia_tipo"]
          titulo: string
          updated_at: string
          url: string | null
        }
        Insert: {
          conteudo?: string
          created_at?: string
          id?: string
          tema_id: string
          tipo: Database["public"]["Enums"]["referencia_tipo"]
          titulo: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          conteudo?: string
          created_at?: string
          id?: string
          tema_id?: string
          tipo?: Database["public"]["Enums"]["referencia_tipo"]
          titulo?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referencias_tema_id_fkey"
            columns: ["tema_id"]
            isOneToOne: false
            referencedRelation: "temas"
            referencedColumns: ["id"]
          },
        ]
      }
      slides: {
        Row: {
          created_at: string
          criativo_id: string
          id: string
          imagem_url: string | null
          ordem: number
          prompt_imagem: string | null
          prompt_texto: string | null
          status: Database["public"]["Enums"]["slide_status"]
          texto: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          criativo_id: string
          id?: string
          imagem_url?: string | null
          ordem: number
          prompt_imagem?: string | null
          prompt_texto?: string | null
          status?: Database["public"]["Enums"]["slide_status"]
          texto?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          criativo_id?: string
          id?: string
          imagem_url?: string | null
          ordem?: number
          prompt_imagem?: string | null
          prompt_texto?: string | null
          status?: Database["public"]["Enums"]["slide_status"]
          texto?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "slides_criativo_id_fkey"
            columns: ["criativo_id"]
            isOneToOne: false
            referencedRelation: "criativos"
            referencedColumns: ["id"]
          },
        ]
      }
      tarefas: {
        Row: {
          created_at: string
          deadline: string | null
          id: string
          status: Database["public"]["Enums"]["tarefa_status"]
          titulo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          id?: string
          status?: Database["public"]["Enums"]["tarefa_status"]
          titulo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deadline?: string | null
          id?: string
          status?: Database["public"]["Enums"]["tarefa_status"]
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      temas: {
        Row: {
          cor: string
          created_at: string
          descricao: string
          icone: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          cor: string
          created_at?: string
          descricao?: string
          icone: string
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          cor?: string
          created_at?: string
          descricao?: string
          icone?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      save_criativo: {
        Args: { p_criativo: Json; p_slides: Json }
        Returns: undefined
      }
    }
    Enums: {
      criativo_formato: "4:5" | "1:1"
      criativo_status: "rascunho" | "pronto" | "agendado" | "publicado"
      referencia_tipo: "link" | "site" | "anotacao"
      slide_status: "vazio" | "gerando" | "gerado" | "editado" | "erro"
      tarefa_status: "pendente" | "em_andamento" | "concluida"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      criativo_formato: ["4:5", "1:1"],
      criativo_status: ["rascunho", "pronto", "agendado", "publicado"],
      referencia_tipo: ["link", "site", "anotacao"],
      slide_status: ["vazio", "gerando", "gerado", "editado", "erro"],
      tarefa_status: ["pendente", "em_andamento", "concluida"],
    },
  },
} as const
