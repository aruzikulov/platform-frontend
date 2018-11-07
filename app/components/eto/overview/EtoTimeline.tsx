import * as cn from "classnames";
import * as React from "react";
import { FormattedDate } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";

import { EETOStateOnChain, TEtoStartOfStates } from "../../../modules/public-etos/types";
import { TTranslatedString } from "../../../types";

import * as styles from "./EtoTimeline.module.scss";

type TBlockTheme = "blue" | "fluorescent-blue" | "green" | "gray" | "gray-opacity";
type TDatePointType = "short";

interface IProps {
  startOfStates: TEtoStartOfStates | undefined;
}

interface IDatePointProps {
  date?: number | string;
  text?: TTranslatedString;
  type?: TDatePointType;
}

interface IBlockProps {
  title?: TTranslatedString;
  theme: TBlockTheme;
  width?: number;
  date?: number;
}

interface IBlockTitle {
  title?: TTranslatedString;
  width: number;
}

interface IPointerProps {
  position?: number;
}

const now = Date.now();

const TIMELINE_WIDTH = 1000;
const TIMELINE_HEIGHT = 106;
const TIMELINE_DYNAMIC_STAGES = 4;

const CAMPAIGNING_BLOCK_WIDTH = 180;
const PAYOUT_BLOCK_WIDTH = 50;

const DEFAULT_BLOCK_WIDTH =
  (TIMELINE_WIDTH - CAMPAIGNING_BLOCK_WIDTH - PAYOUT_BLOCK_WIDTH) / TIMELINE_DYNAMIC_STAGES;
const MORPHING_TIMELINE_WIDTH = TIMELINE_WIDTH - CAMPAIGNING_BLOCK_WIDTH - PAYOUT_BLOCK_WIDTH; // campaining and payout are constant size

const POINTER_HEIGHT = 61;
const POINTER_WIDTH = 26;
const POINTER_CAMPAINING_POSITION = 20;
const MAX_POINTER_POSITION = TIMELINE_WIDTH - 15;

const defaultEtoTimelineContext = {
  blockWidth: DEFAULT_BLOCK_WIDTH,
  blockHeight: 30,
  borderHeight: 4,
  backgroundHeight: 18,
};

const EtoTimelineContext = React.createContext(defaultEtoTimelineContext);

const DatePoint: React.SFC<IDatePointProps> = ({ date, type, text }) => {
  return (
    <g transform="translate(-33 -9)">
      {date && (
        <text className={cn(date > now && styles.datePast, styles.date)}>
          <tspan x="12" y="50">
            <FormattedDate value={date} />
          </tspan>
        </text>
      )}
      {text && (
        <text className={styles.pointerLabel}>
          <tspan x="33" y="-2" textAnchor="middle">
            {text}
          </tspan>
        </text>
      )}
      <rect
        width={type === "short" ? 1 : 3}
        height={type === "short" ? 16 : 32}
        x={32}
        y={type === "short" ? 20 : 4}
        className={cn(styles.datePoint, type)}
      />
    </g>
  );
};

const BlockTitle: React.SFC<IBlockTitle> = ({ title, width }) => {
  return (
    <text className={styles.blockText} textAnchor="middle" transform={`translate(${width / 2} 13)`}>
      {title}
    </text>
  );
};

const StartBlock: React.SFC<IBlockProps> = ({ title, width, theme }) => {
  return (
    <EtoTimelineContext.Consumer>
      {({ backgroundHeight, blockWidth, borderHeight, blockHeight }) => {
        const computedWidth = width || blockWidth;

        return (
          <g className={cn(styles.block, theme)}>
            <polygon
              className={styles.blockBackground}
              points={`${blockHeight} 0 ${computedWidth} 0 ${computedWidth} ${backgroundHeight} 0 ${backgroundHeight} 0 ${backgroundHeight}`}
            />
            <rect
              width={computedWidth}
              height={borderHeight}
              y={backgroundHeight}
              className={styles.blockBorderBottom}
            />
            <BlockTitle title={title} width={computedWidth} />
          </g>
        );
      }}
    </EtoTimelineContext.Consumer>
  );
};

const EndBlock: React.SFC<IBlockProps> = ({ title, width, theme }) => {
  return (
    <EtoTimelineContext.Consumer>
      {({ backgroundHeight, blockWidth, borderHeight }) => {
        const computedWidth = width || blockWidth;

        return (
          <g className={cn(styles.block, theme)}>
            <polygon
              className={styles.blockBackground}
              points={`0 0 ${computedWidth -
                backgroundHeight} 0 ${computedWidth} ${backgroundHeight} ${computedWidth} ${backgroundHeight} 0 ${backgroundHeight}`}
            />
            <rect
              className={styles.blockBorderBottom}
              width={computedWidth}
              height={borderHeight}
              y={backgroundHeight}
            />
            <BlockTitle title={title} width={computedWidth} />
          </g>
        );
      }}
    </EtoTimelineContext.Consumer>
  );
};

const Block: React.SFC<IBlockProps> = ({ title, theme, width }) => {
  return (
    <EtoTimelineContext.Consumer>
      {({ backgroundHeight, blockWidth, borderHeight }) => {
        const computedWidth = width || blockWidth;

        return (
          <g className={cn(styles.block, theme)}>
            <rect className={styles.blockBackground} width={computedWidth} height="19" />
            <rect
              className={styles.blockBorderBottom}
              width={computedWidth}
              height={borderHeight}
              y={backgroundHeight}
            />
            <BlockTitle title={title} width={computedWidth} />
          </g>
        );
      }}
    </EtoTimelineContext.Consumer>
  );
};

const Pointer: React.SFC<IPointerProps> = ({ position }) => {
  const computedPosition = position || 20;

  return (
    <g transform={`translate(${computedPosition} 0)`}>
      <path
        className={styles.pointer}
        d={`M26.5,25 C28.1568543,25 29.5,23.6568543 29.5,22 C29.5,20.3431457 28.1568543,19 26.5,19 C24.8431457,19 23.5,20.3431457 23.5,22 C23.5,23.6568543 24.8431457,25 26.5,25 Z M26,25.9690531 C24.0268442,25.7230041 22.5,24.0398088 22.5,22 C22.5,19.790861 24.290861,18 26.5,18 C28.709139,18 30.5,19.790861 30.5,22 C30.5,24.0398088 28.9731558,25.7230041 27,25.9690531 L27,79 L26,79 L26,25.9690531 Z`}
      />
      <text className={styles.pointerLabel}>
        <tspan x="14" y="12">
          <FormattedMessage id="shared-component.eto-timeline.now" />
        </tspan>
      </text>
    </g>
  );
};

const getStartOfState = (state: EETOStateOnChain, startOfStates: TEtoStartOfStates | undefined) => {
  const startDate = startOfStates && startOfStates[state];

  return startDate ? startDate.getTime() : NaN;
};

export const EtoTimeline: React.SFC<IProps> = ({ startOfStates }) => {
  // start/end dates of phases
  const preEtoStartDate = getStartOfState(EETOStateOnChain.Whitelist, startOfStates);
  const publicEtoStartDate = getStartOfState(EETOStateOnChain.Public, startOfStates);
  const inSigningStartDate = getStartOfState(EETOStateOnChain.Signing, startOfStates);
  const inClaimStartDate = getStartOfState(EETOStateOnChain.Claim, startOfStates);
  const inPayoutStartDate = getStartOfState(EETOStateOnChain.Payout, startOfStates);

  // blocks sizes
  const totalTimeScope = inPayoutStartDate - preEtoStartDate;

  const preEtoWidth =
    ((publicEtoStartDate - preEtoStartDate) / totalTimeScope) * MORPHING_TIMELINE_WIDTH ||
    DEFAULT_BLOCK_WIDTH;
  const publicEtoWidth =
    ((inSigningStartDate - publicEtoStartDate) / totalTimeScope) * MORPHING_TIMELINE_WIDTH ||
    DEFAULT_BLOCK_WIDTH;
  const inSigningWidth =
    ((inClaimStartDate - inSigningStartDate) / totalTimeScope) * MORPHING_TIMELINE_WIDTH ||
    DEFAULT_BLOCK_WIDTH;
  const inClaimWidth =
    ((inPayoutStartDate - inClaimStartDate) / totalTimeScope) * MORPHING_TIMELINE_WIDTH ||
    DEFAULT_BLOCK_WIDTH;

  const pointerPosition = () => {
    const hasStartDate = !isNaN(preEtoStartDate);

    if (!hasStartDate || now < preEtoStartDate) {
      return POINTER_CAMPAINING_POSITION;
    }

    const calculatedPosition =
      CAMPAIGNING_BLOCK_WIDTH +
      ((now - preEtoStartDate) / totalTimeScope) * MORPHING_TIMELINE_WIDTH;

    const position =
      calculatedPosition > MAX_POINTER_POSITION ? MAX_POINTER_POSITION : calculatedPosition;

    return position - POINTER_WIDTH;
  };

  return (
    <EtoTimelineContext.Provider value={defaultEtoTimelineContext}>
      <svg viewBox={`0 0 ${TIMELINE_WIDTH} ${TIMELINE_HEIGHT}`}>
        <g transform={`translate(0 ${POINTER_HEIGHT})`}>
          <g>
            <StartBlock
              title={<FormattedMessage id="eto.status.onchain.setup" />}
              theme="blue"
              width={CAMPAIGNING_BLOCK_WIDTH}
            />
          </g>
          <g transform={`translate(${CAMPAIGNING_BLOCK_WIDTH})`}>
            <Block
              title={<FormattedMessage id="eto.status.onchain.whitelist" />}
              width={preEtoWidth}
              theme="fluorescent-blue"
            />
            <DatePoint
              date={preEtoStartDate}
              text={<FormattedMessage id="eto-timeline.eto-start" />}
            />
          </g>
          <g transform={`translate(${CAMPAIGNING_BLOCK_WIDTH + preEtoWidth})`}>
            <Block
              title={<FormattedMessage id="eto.status.onchain.public" />}
              width={publicEtoWidth}
              theme="green"
            />
            <DatePoint date={publicEtoStartDate} type="short" />
          </g>
          <g transform={`translate(${CAMPAIGNING_BLOCK_WIDTH + preEtoWidth + publicEtoWidth})`}>
            <Block
              title={<FormattedMessage id="eto.status.onchain.signing" />}
              width={inSigningWidth}
              theme="gray"
            />
            <DatePoint
              date={inSigningStartDate}
              text={<FormattedMessage id="eto-timeline.eto-end" />}
            />
          </g>
          <g
            transform={`translate(${CAMPAIGNING_BLOCK_WIDTH +
              preEtoWidth +
              publicEtoWidth +
              inSigningWidth})`}
          >
            <Block
              title={<FormattedMessage id="eto.status.onchain.claim" />}
              width={inClaimWidth}
              theme="gray-opacity"
            />
            <DatePoint date={inClaimStartDate} type="short" />
          </g>
          <g
            transform={`translate(${CAMPAIGNING_BLOCK_WIDTH +
              preEtoWidth +
              publicEtoWidth +
              inSigningWidth +
              inClaimWidth})`}
          >
            <EndBlock theme="gray-opacity" width={PAYOUT_BLOCK_WIDTH} />
            <DatePoint
              date={inPayoutStartDate}
              text={<FormattedMessage id="eto-timeline.neu-payout" />}
            />
          </g>
        </g>
        <Pointer position={pointerPosition()} />
      </svg>
    </EtoTimelineContext.Provider>
  );
};
