import { PickType } from '@nestjs/swagger';
import { ARGBookmarkEntity } from '../../../database/entities';

export class CreateARGBookmarkDto extends PickType(ARGBookmarkEntity, ['adId', 'title'] as const) {}
