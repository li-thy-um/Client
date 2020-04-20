import React from 'react';
import { TagComponent } from '../type';
import { TagCheckboxProps } from './shared';
import { TMemo } from '@shared/components/TMemo';
import { TagCheckboxEdit } from './edit';

export const TagCheckboxDetail: TagComponent<TagCheckboxProps> = TMemo(
  (props) => {
    return <TagCheckboxEdit {...props} disabled={true} />;
  }
);
TagCheckboxDetail.displayName = 'TagCheckboxDetail';
