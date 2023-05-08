export class BaseResponse {
    public success: boolean;
    public message: any;
    public data: any;

    public static from(
          data: any,
          message?: string,
          success: boolean = true
    ): BaseResponse {
          const response: BaseResponse = new BaseResponse();
          response.success = success;
          response.data = data;
          response.message = message;
          return response;
    }

    constructor() {
          this.success = false;
    }
}
