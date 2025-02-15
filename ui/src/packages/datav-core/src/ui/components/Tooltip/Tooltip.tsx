import React, { createRef, FC } from 'react';
import { VirtualElement } from '@popperjs/core';
import { Popover } from './Popover';
import { PopoverController, UsingPopperProps } from './PopoverController';
import './Tooltip.less'

export interface TooltipProps extends UsingPopperProps {
  theme?: 'info' | 'error' | 'info-alt';
}

export interface PopoverContentProps {
  updatePopperPosition?: () => void;
}

export type PopoverContent = string | React.ReactElement<any> | ((props: PopoverContentProps) => JSX.Element);

export const Tooltip: FC<TooltipProps> = React.memo(({ children, theme, ...controllerProps }: TooltipProps) => {
  const tooltipTriggerRef = createRef<HTMLElement | VirtualElement>();
  const popperBackgroundClassName = 'popper__background' + (theme ? ' popper__background--' + theme : '');

  return (
    <PopoverController {...controllerProps}>
      {(showPopper, hidePopper, popperProps) => {
        {
          /* Override internal 'show' state if passed in as prop */
        }
        const payloadProps = {
          ...popperProps,
          show: controllerProps.show !== undefined ? controllerProps.show : popperProps.show,
        };
        return (
          <>
            {tooltipTriggerRef.current && controllerProps.content && (
              <Popover
                {...payloadProps}
                onMouseEnter={showPopper}
                onMouseLeave={hidePopper}
                referenceElement={tooltipTriggerRef.current}
                wrapperClassName="popper"
                className={popperBackgroundClassName}
                renderArrow={({ arrowProps, placement }) => (
                  <div className="popper__arrow" data-placement={placement} {...arrowProps} />
                )}
              />
            )}
            {React.cloneElement(children, {
              ref: tooltipTriggerRef,
              onMouseEnter: showPopper,
              onMouseLeave: hidePopper,
            })}
          </>
        );
      }}
    </PopoverController>
  );
});

Tooltip.displayName = 'Tooltip';
