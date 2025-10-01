export type DataResponseType =
  | {
      status: string;
      message: string;
      result?: never;
    }
  | {
      status: string;
      result: any;
      message?: never;
    };
