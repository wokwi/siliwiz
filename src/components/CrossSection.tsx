import { For } from 'solid-js';
import { layout, rectLayer } from '~/model/layout';
import { setViewerState, viewerState } from '~/model/viewerState';

export default function CrossSection(props: { height: number }) {
  const crossRects = () =>
    layout.rects.filter(
      (r) => r.y <= viewerState.crossSectionY && r.y + r.height >= viewerState.crossSectionY,
    );
  const sliderTranslate = () => `-${props.height / 2 - 15}px, ${props.height / 2 - 10}px`;
  return (
    <div style={{ display: 'flex' }}>
      <span style={{ width: '30px' }}>
        <input
          type="range"
          min={0}
          max={props.height}
          style={{
            transform: `translate(${sliderTranslate()}) rotate(90deg)`,
            width: props.height + 'px',
          }}
          value={viewerState.crossSectionOffset}
          onInput={(e) =>
            setViewerState('crossSectionOffset', (e.target as HTMLInputElement).valueAsNumber)
          }
        />
      </span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <defs>
          <pattern
            id="hatch-pattern"
            patternUnits="userSpaceOnUse"
            width="20"
            height="20"
            patternTransform="rotate(-45 0 0)"
          >
            <line x1="0" y1="0" x2="0" y2="20" stroke="white" stroke-width="20" />
          </pattern>
          <mask id="hatch-mask" x="0" y="0" width="1" height="1">
            <rect x="0" y="0" width="1000" height="1000" fill="url(#hatch-pattern)" />
          </mask>
        </defs>
        <For each={crossRects()}>
          {(rect) => {
            const layer = rectLayer(rect);
            if (!layer) {
              return;
            }

            return (
              <rect
                x={rect.x}
                y={layer.crossY}
                height={layer.crossHeight}
                width={rect.width}
                fill={layer.color}
                mask={layer.hatched ? 'url(#hatch-mask)' : undefined}
              />
            );
          }}
        </For>
      </svg>
    </div>
  );
}
