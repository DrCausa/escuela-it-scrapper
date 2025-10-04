export type ResultResponse =
  | {
      status: string;
      message: string;
      result?: string | boolean | Data;
    }
  | {
      status: string;
      result: string;
      message?: string;
    };

export type DataRow = {
  id: string;
  fileName: string;
  generatedAt: number;
  content: string;
};

export type Data = DataRow[];
