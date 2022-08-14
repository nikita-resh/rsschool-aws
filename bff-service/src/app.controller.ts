import { Controller, Param, HttpException, HttpStatus, Query, All, Req } from '@nestjs/common';
import axios from 'axios';
import { Request } from 'express';

const isServiceExists = (serviceName: string) => {
  return Boolean(process.env[serviceName]);
};

const isEmptyObject = (obj: Object) => {
  return Object.keys(obj).length === 0;
};

@Controller()
export class AppController {
  @All('/:service')
  async serviceGet(
    @Param('service') service: string,
    @Query('id') id: string,
    @Req() req: Request,
  ): Promise<any> {
    if (!isServiceExists(service)) {
      throw new HttpException(`Cannot process request`, HttpStatus.BAD_GATEWAY);
    }

    try {
      const response = await axios.request({
        method: req.method,
        url: process.env[service] + (id ? `/${id}` : ''),
        data: isEmptyObject(req.body) ? null : req.body,
      });

      return response.data;
    } catch (err: any) {
      console.log(err);
      throw new HttpException(err.response.data.message, err.response.status);
    }
  }
}
