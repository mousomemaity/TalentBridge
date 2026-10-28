import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { StageKind } from '../../common/constants/roles.enum';

export type PipelineTemplateDocument = PipelineTemplate & Document;

@Schema({ _id: false })
export class TemplateStageItem {
  @Prop({ type: String, default: uuidv4 })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: StageKind })
  kind: StageKind;

  @Prop({ required: true, default: 0 })
  position: number;

  @Prop({ default: 3 })
  slaDays: number;
}

@Schema({ timestamps: true, collection: 'pipeline_templates' })
export class PipelineTemplate {
  @Prop({ type: String, default: uuidv4 })
  _id: string;

  get id(): string {
    return this._id;
  }

  @Prop({ required: true, index: true })
  tenantId: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ default: false })
  isDefault: boolean;

  @Prop({ type: [TemplateStageItem], default: [] })
  stages: TemplateStageItem[];

  createdAt?: Date;
  updatedAt?: Date;
}

export const PipelineTemplateSchema = SchemaFactory.createForClass(PipelineTemplate);
PipelineTemplateSchema.virtual('id').get(function () {
  return this._id;
});
