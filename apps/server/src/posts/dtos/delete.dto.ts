import { OmitType } from '@nestjs/swagger';

import { PostDto } from './common.dto';

export class PostDeleteResponseDto extends OmitType(PostDto, ['comments'] as const) {}
