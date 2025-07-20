import { injectable } from 'inversify';
import type { Context } from 'hono';
import path from 'path';
import fs from 'fs/promises';

export interface IFileUploadService {
  handleUpload(c: Context): Promise<Response> | Promise<any>;
}

@injectable()
export class FileUploadService {
  private uploadDir = path.resolve('./uploads');

  constructor() {
    fs.mkdir(this.uploadDir, { recursive: true }).catch(console.error);
  }

  async handleUpload(c: Context) {
    try {
      const formData = await c.req.formData();
      const file = formData.get('file');

      if (!file || !(file instanceof File)) {
        return c.json({ success: false, error: '未找到上传文件' }, 400);
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // 你可以自定义文件名，这里用原始名加时间戳避免冲突
      const filename = `${Date.now()}_${file.name}`;
      const filepath = path.join(this.uploadDir, filename);

      await fs.writeFile(filepath, buffer);

      return c.json({
        success: true,
        filename,
        originalFilename: file.name,
        size: file.size,
      });
    } catch (err) {
      console.error(err);
      return c.json({ success: false, error: (err as Error).message }, 500);
    }
  }
}