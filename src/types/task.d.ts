
export interface Task {
    id?: string;
    userId: string;
    t_id: string;
    task_id?: string;
    model: string;
    action: string;
    LLM_Params: string;
    track_id?: string;
    result?: string;
    remark?: string;
    status: string;
    create_at: number;
    update_at: number;
}   
