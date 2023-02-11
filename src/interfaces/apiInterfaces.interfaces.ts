export interface deleteObjectInterface {
    indentLevel: number;
    comments: string[];
}

export interface editCommentObjectInterface {
    indentLevel: number;
    comments: string[];
    content: string;
}

export interface editCommentScoreObjectInterface {
    indentLevel: number;
    comments: string[];
    scoreUp: boolean;
}
