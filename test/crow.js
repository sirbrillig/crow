import { expect } from 'chai';

import { getCrowAt } from '../crow';

const mockRootDir = '/foo/bar';
const firstBranchName = 'my-branch';

describe( 'crow', function() {
	let crow;

	beforeEach( function() {
		crow = getCrowAt( mockRootDir );
	} );

	describe( '.getRootDir', function() {
		it( 'returns the full path to the config directory', function() {
			expect( crow.getRootDir() ).to.eql( mockRootDir );
		} );
	} );

	describe( '.getBranchFile', function() {
		it( 'returns null when there is no branch set', function() {
			expect( crow.getBranchFile() ).to.eql( null );
		} );

		it( 'returns the full path to the branch directory when there is a branch set', function() {
			crow.setCurrentBranch( firstBranchName );
			expect( crow.getBranchFile() ).to.eql( `${mockRootDir}/refs/heads/${firstBranchName}` );
		} );
	} );
} );
