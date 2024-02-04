import { PickType } from '@nestjs/swagger';
import { ARGPanelMenuEntity } from '../../../database/entities/person/panel-menu/panel-menu.entity';

export class CreateARGPanelMenuDto extends PickType(ARGPanelMenuEntity, [
  'name',
  'parentMenu',
  'subMenus',
] as const) {}
