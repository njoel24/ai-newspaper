import * as React from 'react';
import { createComponent } from '@lit/react';
import { EvaluatorUI as EvaluatorElement } from './evaluator-ui';

const EvaluatorUI = createComponent({
  react: React,
  tagName: 'evaluator-ui',
  elementClass: EvaluatorElement,
});

export default EvaluatorUI;
