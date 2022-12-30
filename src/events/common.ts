import { Listicle } from '~/data-types';

export const LISTICLE_UPDATED = 'listicle_updated';

export type ListicleMessageHandler = (parseListicle: Listicle) => void;
