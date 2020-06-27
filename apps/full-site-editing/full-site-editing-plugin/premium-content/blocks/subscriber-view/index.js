/**
 * Internal dependencies
 */
import edit from './edit';
import save from './save';
import { getCategoryWithFallbacks } from '../../../block-helpers';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

const name = 'premium-content/subscriber-view';
const category = getCategoryWithFallbacks( 'common', 'design' );
const settings = {
	name,
	category,
	attributes: {},

	/* translators: block name */
	title: __( 'Subscriber View', 'full-site-editing' ),
	/* translators: block description */
	description: __( 'Subscriber View.', 'full-site-editing' ),
	parent: [ 'premium-content/container' ],
	supports: {
		// Hide this block from the inserter.
		inserter: false,
		html: false,
	},
	edit,
	save,
};

export { name, category, settings };
