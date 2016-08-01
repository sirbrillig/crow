import { expect } from 'chai';

import { getCrowAt } from '../crow';

describe( 'getRootDir', function() {
	const mockRootDir = '/foo/bar';

	it( 'returns the full path to the config directory', function() {
		const crow = getCrowAt( mockRootDir );
		expect( crow.getRootDir() ).to.eql( mockRootDir );
	} );
} );
