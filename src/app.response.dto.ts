export class ApiResponseDTO {
  status: 'SUCCESS' | 'ERROR';
  message?: string | null;
  content: unknown;
  error?: boolean;
}

export class BaseResponseDTO<T> {
  totalRecord: number;
  content: T;
}
