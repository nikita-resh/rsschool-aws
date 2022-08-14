import {
  All,
  CACHE_MANAGER,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Query,
  Req,
  Request,
} from '@nestjs/common';
import axios from 'axios';
import { Cache } from 'cache-manager';

const isServiceExists = (serviceName: string) => {
  return Boolean(process.env[serviceName]);
};

const isEmptyObject = (obj: Object) => {
  return Object.keys(obj).length === 0;
};

@Controller()
export class AppController {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  @All('/:service')
  async serviceGet(
    @Param('service') service: string,
    @Query('id') id: string,
    @Req() req: Request,
  ): Promise<any> {
    if (!isServiceExists(service)) {
      throw new HttpException(`Cannot process request`, HttpStatus.BAD_GATEWAY);
    }

    const isGetProductsRequest = req.method === 'GET' && req.url.includes('product');

    try {
      if (isGetProductsRequest) {
        const cachedValue = await this.cacheManager.get(req.url);
        if (cachedValue) {
          return cachedValue;
        }
      }

      const response = await axios.request({
        method: req.method,
        url: process.env[service] + (id ? `/${id}` : ''),
        data: isEmptyObject(req.body) ? null : req.body,
      });

      if (isGetProductsRequest) {
        await this.cacheManager.set(req.url, response.data);
      }

      return response.data;
    } catch (err: any) {
      console.log(err);
      throw new HttpException(err.response.data.message, err.response.status);
    }
  }
}
