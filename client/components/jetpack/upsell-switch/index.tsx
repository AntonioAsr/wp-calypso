/**
 * External dependencies
 */
import React, { ReactElement, useState, ReactNode, useEffect, ComponentType } from 'react';
import { connect, DefaultRootState } from 'react-redux';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import Main from 'components/main';
import isJetpackCloud from 'lib/jetpack/is-jetpack-cloud';
import { getSelectedSiteId } from 'state/ui/selectors';
import isAtomicSite from 'state/selectors/is-site-wpcom-atomic';

type QueryComponentProps = {
	siteId: number | null;
};

type QueryFunction = ( arg0: DefaultRootState, arg1: number | null ) => SiteState;
type RequestFunction = ( arg0: DefaultRootState, arg1: number | null ) => boolean;

export type UpsellComponentProps = {
	reason?: string;
};

type SiteState = {
	state: string;
	reason?: string;
};

type Props = {
	children: ReactNode;
	UpsellComponent: ComponentType< UpsellComponentProps >;
	display: ReactElement;
	QueryComponent: ComponentType< QueryComponentProps >;
	getStateForSite: QueryFunction;
	isRequestingForSite: RequestFunction;
	siteId: number | null;
	siteState: SiteState | null;
	atomicSite: boolean;
	isRequesting: boolean;
};

const UI_STATE_LOADING = Symbol( 'loading' );
const UI_STATE_LOADED = Symbol( 'loaded' );

type UiState = typeof UI_STATE_LOADED | typeof UI_STATE_LOADING | null;

function UpsellSwitch( props: Props ): React.ReactElement {
	const {
		UpsellComponent,
		QueryComponent,
		display,
		children,
		siteId,
		siteState,
		atomicSite,
		isRequesting,
	} = props;
	const { state, reason } = siteState || {};

	const [ uiState, setUiState ] = useState< UiState >( null );
	const [ showUpsell, setUpsell ] = useState( false );

	// The data queried by QueryComponent can be fetched at any time by other
	// parts of the app and therefore trigger a rendering of the loading state.
	// We want to prevent that by making sure the component renders its loading
	// state only once while mounted.
	useEffect( () => {
		if ( ! uiState && isRequesting ) {
			setUiState( UI_STATE_LOADING );
		}
		if ( UI_STATE_LOADING === uiState && ! isRequesting ) {
			setUiState( UI_STATE_LOADED );
		}
	}, [ uiState, isRequesting ] );

	useEffect( () => {
		// Show the expected content only if the state is distinct to unavailable
		// (active, inactive, provisioning) or if the site is Atomic
		if ( UI_STATE_LOADED === uiState && ! atomicSite && ( ! state || state === 'unavailable' ) ) {
			setUpsell( true );
		}
	}, [ uiState, atomicSite, state ] );

	if ( UI_STATE_LOADED !== uiState ) {
		return (
			<Main
				className={ classNames( 'upsell-switch__loading', { is_jetpackcom: isJetpackCloud() } ) }
			>
				<QueryComponent siteId={ siteId } />
				{ children }
			</Main>
		);
	}
	if ( showUpsell ) {
		return <UpsellComponent reason={ reason } />;
	}
	return display;
}

export default connect( ( state, { getStateForSite, isRequestingForSite }: Props ) => {
	const siteId = getSelectedSiteId( state );

	return {
		siteId,
		siteState: getStateForSite( state, siteId ),
		atomicSite: !! ( siteId && isAtomicSite( state, siteId ) ),
		isRequesting: isRequestingForSite( state, siteId ),
	};
} )( UpsellSwitch );
