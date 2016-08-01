import { expect } from 'chai';
import mockFs from 'mock-fs';

import Crow from '../crow';

const mockRootDir = '/foo/bar';
const firstBranchName = 'my-branch';

describe( 'crow', function() {
	let crow;

	beforeEach( function() {
		const myFs = mockFs.fs( {
			[ mockRootDir ]: {}
		} );
		crow = new Crow( mockRootDir, myFs );
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

	describe( '.getCurrentBranch', function() {
		it( 'returns null if no branch has been set', function() {
			expect( crow.getCurrentBranch() ).to.eql( null );
		} );

		it( 'returns the current branch name if one is set', function() {
			crow.setCurrentBranch( firstBranchName );
			expect( crow.getCurrentBranch() ).to.eql( firstBranchName );
		} );
	} );

	describe( '.getCurrentBranchHead', function() {
		it( 'returns null if no branch has been set', function() {
			expect( crow.getCurrentBranchHead() ).to.eql( null );
		} );

		it( 'returns null if no commits have been made to a new branch', function() {
			crow.setCurrentBranch( firstBranchName );
			expect( crow.getCurrentBranchHead() ).to.eql( null );
		} );

		it( 'returns the last commit hash on the branch if one has been made', function() {
			const commitA = 'abcd';
			const myFs = mockFs.fs( {
				[ mockRootDir ]: {
					refs: {
						heads: {
							[ firstBranchName ]: commitA
						}
					}
				}
			} );
			crow = new Crow( mockRootDir, myFs );
			crow.setCurrentBranch( firstBranchName );
			expect( crow.getCurrentBranchHead() ).to.eql( commitA );
		} );
	} );
} );
