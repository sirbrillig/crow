import { expect } from 'chai';
import mockFs from 'mock-fs';

import Crow from '../crow';

const mockRootDir = '/foo/bar';
const firstBranchName = 'my-branch';

describe( 'crow', function() {
	let crow;
	let myFs;

	beforeEach( function() {
		myFs = mockFs.fs( {
			[ mockRootDir ]: {
				refs: {
					heads: {}
				}
			}
		} );
		crow = new Crow( mockRootDir, { fs: myFs } );
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

		it( 'returns the full path to the current branch directory when there is a branch set', function() {
			crow.setCurrentBranch( firstBranchName );
			expect( crow.getBranchFile() ).to.eql( `${mockRootDir}/refs/heads/${firstBranchName}` );
		} );

		it( 'returns the full path to the named branch directory when provided', function() {
			const otherBranchName = 'other-branch';
			expect( crow.getBranchFile( otherBranchName ) ).to.eql( `${mockRootDir}/refs/heads/${otherBranchName}` );
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
		it( 'throws an error if the root dir does not exist', function() {
			myFs = mockFs.fs( {} );
			crow = new Crow( mockRootDir, { fs: myFs } );
			expect( crow.getCurrentBranchHead.bind( crow ) ).to.throw();
		} );

		it( 'returns null if no branch has been set', function() {
			expect( crow.getCurrentBranchHead() ).to.eql( null );
		} );

		it( 'returns null if no commits have been made to a new branch', function() {
			crow.createNewBranch( firstBranchName );
			crow.setCurrentBranch( firstBranchName );
			expect( crow.getCurrentBranchHead() ).to.eql( null );
		} );

		it( 'returns the last commit hash on the branch if one has been made', function() {
			const commitA = 'abcd';
			myFs = mockFs.fs( {
				[ mockRootDir ]: {
					refs: {
						heads: {
							[ firstBranchName ]: commitA
						}
					}
				}
			} );
			crow = new Crow( mockRootDir, { fs: myFs } );
			crow.setCurrentBranch( firstBranchName );
			expect( crow.getCurrentBranchHead() ).to.eql( commitA );
		} );
	} );

	describe( '.createNewBranch', function() {
		it( 'creates a new branch file if one does not exist', function() {
			crow.createNewBranch( 'new-branch' );
			expect( myFs.accessSync.bind( myFs, `${mockRootDir}/refs/heads/new-branch` ) ).to.not.throw();
		} );

		it( 'creates an empty branch file', function() {
			crow.createNewBranch( 'new-branch' );
			expect( myFs.readFileSync( `${mockRootDir}/refs/heads/new-branch`, 'utf8' ) ).to.eql( '' );
		} );

		it( 'fails if that branch file already exists', function() {
			myFs = mockFs.fs( {
				[ mockRootDir ]: {
					refs: {
						heads: {
							[ firstBranchName ]: 'abcd'
						}
					}
				}
			} );
			crow = new Crow( mockRootDir, { fs: myFs } );
			expect( crow.createNewBranch.bind( crow, firstBranchName ) ).to.throw();
		} );
	} );

	describe( '.setCurrentBranch', function() {
		it( 'fails if the root directory does not exist', function() {
			myFs = mockFs.fs( {} );
			crow = new Crow( mockRootDir, { fs: myFs } );
			expect( crow.setCurrentBranch.bind( crow ) ).to.throw();
		} );

		it( 'sets the current branch', function() {
			crow.setCurrentBranch( firstBranchName );
			expect( crow.getCurrentBranch() ).to.eql( firstBranchName );
		} );

		it( 'writes the current branch to the HEAD file', function() {
			crow.setCurrentBranch( firstBranchName );
			expect( myFs.readFileSync( `${mockRootDir}/HEAD`, 'utf8' ) ).to.eql( firstBranchName );
		} );
	} );
} );
