export type ResultResponse =
  | {
      status: string;
      message: string;
      result?: string | boolean | Data | Blob;
    }
  | {
      status: string;
      result: string;
      message?: string;
    };

export type DataRow = {
  id: string;
  file_name: string;
  generated_at: number;
  content?: string;
  is_audio?: boolean;
};

export type Data = DataRow[];
