'use client';

import { AnchorHTMLAttributes, forwardRef, MouseEvent } from 'react';
import { EventParams } from './events';
import { linkDomain, track } from './track';

type OutboundParams = Omit<EventParams<'outbound_click'>, 'link_domain'>;
type PortfolioParams = Omit<EventParams<'portfolio_outbound_click'>, 'link_domain'>;

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string } & (
    | { event: 'outbound_click'; params: OutboundParams }
    | { event: 'portfolio_outbound_click'; params: PortfolioParams }
  );

/** Send the outbound event for a link (link_domain is derived from the URL). */
export function trackOutbound(href: string, event: Props['event'], params: OutboundParams | PortfolioParams) {
  const link_domain = linkDomain(href);
  if (event === 'portfolio_outbound_click') track(event, { ...(params as PortfolioParams), link_domain });
  else track(event, { ...(params as OutboundParams), link_domain });
}

/**
 * A real link to another site (DATA-03): <a target="_blank" rel="noopener noreferrer"> that sends one typed event on
 * click. Real links (instead of window.open) also give GA4's automatic outbound click, middle-click and copy-link.
 */
const OutboundLink = forwardRef<HTMLAnchorElement, Props>(function OutboundLink(
  { event, params, onClick, target = '_blank', rel = 'noopener noreferrer', href, children, ...rest },
  ref,
) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    trackOutbound(href, event, params);
    onClick?.(e);
  };
  return (
    // href named on the element, so the linter sees a link (it is one: the keyboard follows it like any link).
    <a ref={ref} href={href} target={target} rel={rel} {...rest} onClick={handleClick}>
      {children}
    </a>
  );
});

export default OutboundLink;
