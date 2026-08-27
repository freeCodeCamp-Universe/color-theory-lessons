import { useId } from 'react';
import type { ReactNode } from 'react';
import type { StepPanelConfig } from '../../types/lesson.ts';
import { VisualDescription } from '../accessibility/VisualDescription.tsx';
import { ColorWheelTool } from '../tools/ColorWheelTool.tsx';
import { HSLSliderTool } from '../tools/HSLSliderTool.tsx';
import { RGBMixerTool } from '../tools/RGBMixerTool.tsx';
import { HslPlaygroundTool } from '../tools/HslPlaygroundTool.tsx';
import { VisionCardsTool } from '../tools/VisionCardsTool.tsx';
import { InterfaceGalleryTool } from '../tools/InterfaceGalleryTool.tsx';
import { BeforeAfterTool } from '../tools/BeforeAfterTool.tsx';

interface Props {
  panel: StepPanelConfig | null | undefined;
}

export default function StepPanelRenderer({ panel }: Props) {
  if (!panel) return null;
  return <StepPanelVisual panel={panel}>{renderPanel(panel)}</StepPanelVisual>;
}

function renderPanel(panel: StepPanelConfig) {
  switch (panel.type) {
    case 'color-wheel-preview':
      return <ColorWheelTool interactive={false} previewRelationship={panel.relationship} />;
    case 'hsl-slider-preview':
      return <HSLSliderTool interactive={true} previewDimension={panel.dimension} />;
    case 'rgb-mixer-preview':
      return <RGBMixerTool interactive={false} previewMode={panel.mode} />;
    case 'hsl-playground-preview':
      return <HslPlaygroundTool interactive={false} />;
    case 'vision-cards-preview':
      return <VisionCardsTool interactive={false} previewExpandedNames={panel.expandedNames} />;
    case 'interface-gallery-preview':
      return <InterfaceGalleryTool interactive={false} previewSimulation={panel.simulation} />;
    case 'before-after-preview':
      return <BeforeAfterTool interactive={false} previewMockup={panel.mockup} />;
    default:
      return null;
  }
}

function StepPanelVisual({ panel, children }: { panel: StepPanelConfig; children: ReactNode }) {
  const descriptionId = useId();
  const accessibility = panel.accessibility;

  if (accessibility?.classification === 'decorative') {
    return <div aria-hidden="true">{children}</div>;
  }

  if (!accessibility) return children;

  return (
    <div data-authored-visual aria-describedby={descriptionId}>
      {children}
      <VisualDescription id={descriptionId} visual={accessibility} />
    </div>
  );
}
