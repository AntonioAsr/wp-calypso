/**
 * Internal dependencies
 */
import { addExternalMedia as addExternalMediaThunk } from 'state/media/thunks/add-external-media';
import { uploadMedia } from 'state/media/thunks/upload-media';

jest.mock( 'state/media/thunks/upload-media', () => ( { uploadMedia: jest.fn() } ) );

describe( 'media - thunks - addExternalMedia', () => {
	const site = Symbol( 'site' );
	const file = Symbol( 'file' );
	const service = Symbol( 'service' );
	const dispatch = jest.fn();
	const getState = jest.fn();

	const addExternalMedia = ( ...args ) => addExternalMediaThunk( ...args )( dispatch, getState );

	it( 'should dispatch to uploadMedia with the file uploader', async () => {
		await addExternalMedia( site, file, service );

		expect( uploadMedia ).toHaveBeenCalledWith( file, site, expect.any( Function ) );
	} );
} );
