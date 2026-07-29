export interface recipe {
    id: number;
    recipe_name: string;
    description: string;
    created_at: string;
    total_time_min: number;
    servings: number;
    oven_required: boolean;
    stove_required: boolean;
    microwave_required: boolean;
    original_link: string;
}

export interface instruction {
    instruction_id: number;
    recipe_id: number;
    step_num: number;
    instruction_detail: string;
}

export interface ingredient {
    ingredient_id: number;
    ingredient_name: string;
}

export interface ingredient_quantity {
    recipe_id: number;
    ingredient_id: number;
    quantity: string;
}