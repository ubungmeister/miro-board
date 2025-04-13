export interface Board {
  id: string;
  title: string;
  createdBy: string;
  createdAt: Date;
  notes: Array<Note>;
}

export interface Note {
    id: string;
    content: string;
    posX: number;
    posY: number;
    color: string;
    createdAt: Date;
    createdBy: string;  
    boardId: string;
  }
  
