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
      agent_threads: {
        Row: {
          agent_id: string
          created_at: string
          id: string
          latest_history_turn_id: number
          running_turn_id: number | null
          server_recorded: boolean
          thread_id: string
          title: string | null
          updated_at: string
          user_id: string
          version: number
        }
        Insert: {
          agent_id: string
          created_at?: string
          id?: string
          latest_history_turn_id?: number
          running_turn_id?: number | null
          server_recorded?: boolean
          thread_id: string
          title?: string | null
          updated_at?: string
          user_id: string
          version?: number
        }
        Update: {
          agent_id?: string
          created_at?: string
          id?: string
          latest_history_turn_id?: number
          running_turn_id?: number | null
          server_recorded?: boolean
          thread_id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
          version?: number
        }
        Relationships: []
      }
      employees: {
        Row: {
          attendance_pattern: Json
          created_at: string
          employee_code: string
          gradient: string
          id: string
          initials: string
          name: string
          overtime_spike: number
          peer_sentiment: number
          peer_sentiment_baseline: number
          risk_score: number
          role: string
          sentiment_drop: number
          skill_matrix: Json
          status: string
          tenure: string
          updated_at: string
        }
        Insert: {
          attendance_pattern?: Json
          created_at?: string
          employee_code: string
          gradient: string
          id?: string
          initials: string
          name: string
          overtime_spike?: number
          peer_sentiment?: number
          peer_sentiment_baseline?: number
          risk_score?: number
          role: string
          sentiment_drop?: number
          skill_matrix?: Json
          status?: string
          tenure: string
          updated_at?: string
        }
        Update: {
          attendance_pattern?: Json
          created_at?: string
          employee_code?: string
          gradient?: string
          id?: string
          initials?: string
          name?: string
          overtime_spike?: number
          peer_sentiment?: number
          peer_sentiment_baseline?: number
          risk_score?: number
          role?: string
          sentiment_drop?: number
          skill_matrix?: Json
          status?: string
          tenure?: string
          updated_at?: string
        }
        Relationships: []
      }
      mobility_plan: {
        Row: {
          created_at: string
          current_competencies: Json
          employee_code: string
          id: string
          match_score: number
          required_skills: Json
          roadmap_phases: Json
          skill_delta: Json
          target_role: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_competencies?: Json
          employee_code: string
          id?: string
          match_score?: number
          required_skills?: Json
          roadmap_phases?: Json
          skill_delta?: Json
          target_role?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_competencies?: Json
          employee_code?: string
          id?: string
          match_score?: number
          required_skills?: Json
          roadmap_phases?: Json
          skill_delta?: Json
          target_role?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mobility_plan_employee_code_fkey"
            columns: ["employee_code"]
            isOneToOne: true
            referencedRelation: "employees"
            referencedColumns: ["employee_code"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          role: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          role?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string
        }
        Relationships: []
      }
      retention_task_events: {
        Row: {
          created_at: string
          evidence: string
          id: string
          recorded_by: string
          status: string
          task_id: string
        }
        Insert: {
          created_at?: string
          evidence: string
          id?: string
          recorded_by: string
          status: string
          task_id: string
        }
        Update: {
          created_at?: string
          evidence?: string
          id?: string
          recorded_by?: string
          status?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "retention_task_events_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "retention_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      retention_tasks: {
        Row: {
          due_at: string | null
          evidence: string | null
          id: string
          node_id: string | null
          owner_label: string
          position: number
          recorded_at: string | null
          recorded_by: string | null
          status: string
          title: string
          workflow_id: string
        }
        Insert: {
          due_at?: string | null
          evidence?: string | null
          id?: string
          node_id?: string | null
          owner_label: string
          position: number
          recorded_at?: string | null
          recorded_by?: string | null
          status?: string
          title: string
          workflow_id: string
        }
        Update: {
          due_at?: string | null
          evidence?: string | null
          id?: string
          node_id?: string | null
          owner_label?: string
          position?: number
          recorded_at?: string | null
          recorded_by?: string | null
          status?: string
          title?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "retention_tasks_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "workflow_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "retention_tasks_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_nodes: {
        Row: {
          created_at: string
          id: string
          owner: string
          position: number
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          owner: string
          position: number
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          owner?: string
          position?: number
          title?: string
        }
        Relationships: []
      }
      workflows: {
        Row: {
          created_at: string
          created_by: string | null
          employee_id: string
          id: string
          plan_summary: string | null
          status: string
          tracking_mode: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          employee_id: string
          id?: string
          plan_summary?: string | null
          status?: string
          tracking_mode?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          employee_id?: string
          id?: string
          plan_summary?: string | null
          status?: string
          tracking_mode?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflows_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      record_retention_task: {
        Args: { p_completed: boolean; p_evidence: string; p_task_id: string }
        Returns: undefined
      }
      start_retention_case: {
        Args: { p_actions?: Json; p_employee_id: string; p_summary?: string }
        Returns: string
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
