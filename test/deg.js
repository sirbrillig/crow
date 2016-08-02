import { expect } from 'chai';
import mockFs from 'mock-fs';

import Deg from '../deg';

const mockRootDir = '/foo/bar';
const firstBranchName = 'my-branch';

describe( 'deg', function() {
	let deg;
	let myFs;

	beforeEach( function() {
		myFs = mockFs.fs( {
			[ mockRootDir ]: {
				refs: {
					heads: {}
				}
			}
		} );
		deg = new Deg( mockRootDir, { fs: myFs } );
	} );

	describe( '.getRootDir', function() {
		it( 'returns the full path to the config directory', function() {
			expect( deg.getRootDir() ).to.eql( mockRootDir );
		} );
	} );

	describe( '.getBranchFile', function() {
		it( 'returns null when there is no branch set', function() {
			expect( deg.getBranchFile() ).to.eql( null );
		} );

		it( 'returns the full path to the current branch directory when there is a branch set', function() {
			deg.setCurrentBranch( firstBranchName );
			expect( deg.getBranchFile() ).to.eql( `${mockRootDir}/refs/heads/${firstBranchName}` );
		} );

		it( 'returns the full path to the named branch directory when provided', function() {
			const otherBranchName = 'other-branch';
			expect( deg.getBranchFile( otherBranchName ) ).to.eql( `${mockRootDir}/refs/heads/${otherBranchName}` );
		} );
	} );

	describe( '.getCurrentBranch', function() {
		it( 'returns null if no branch has been set', function() {
			expect( deg.getCurrentBranch() ).to.eql( null );
		} );

		it( 'returns the current branch name if one is set', function() {
			deg.setCurrentBranch( firstBranchName );
			expect( deg.getCurrentBranch() ).to.eql( firstBranchName );
		} );
	} );

	describe( '.getCurrentBranchHead', function() {
		it( 'throws an error if the root dir does not exist', function() {
			myFs = mockFs.fs( {} );
			deg = new Deg( mockRootDir, { fs: myFs } );
			expect( deg.getCurrentBranchHead.bind( deg ) ).to.throw();
		} );

		it( 'returns null if no branch has been set', function() {
			expect( deg.getCurrentBranchHead() ).to.eql( null );
		} );

		it( 'returns null if no commits have been made to a new branch', function() {
			deg.createNewBranch( firstBranchName );
			deg.setCurrentBranch( firstBranchName );
			expect( deg.getCurrentBranchHead() ).to.eql( null );
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
			deg = new Deg( mockRootDir, { fs: myFs } );
			deg.setCurrentBranch( firstBranchName );
			expect( deg.getCurrentBranchHead() ).to.eql( commitA );
		} );
	} );

	describe( '.createNewBranch', function() {
		it( 'creates a new branch file if one does not exist', function() {
			deg.createNewBranch( 'new-branch' );
			expect( myFs.accessSync.bind( myFs, `${mockRootDir}/refs/heads/new-branch` ) ).to.not.throw();
		} );

		it( 'creates an empty branch file', function() {
			deg.createNewBranch( 'new-branch' );
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
			deg = new Deg( mockRootDir, { fs: myFs } );
			expect( deg.createNewBranch.bind( deg, firstBranchName ) ).to.throw();
		} );
	} );

	describe( '.setCurrentBranch', function() {
		it( 'fails if the root directory does not exist', function() {
			myFs = mockFs.fs( {} );
			deg = new Deg( mockRootDir, { fs: myFs } );
			expect( deg.setCurrentBranch.bind( deg ) ).to.throw();
		} );

		it( 'sets the current branch', function() {
			deg.setCurrentBranch( firstBranchName );
			expect( deg.getCurrentBranch() ).to.eql( firstBranchName );
		} );

		it( 'writes the current branch to the HEAD file', function() {
			deg.setCurrentBranch( firstBranchName );
			expect( myFs.readFileSync( `${mockRootDir}/HEAD`, 'utf8' ) ).to.eql( firstBranchName );
		} );
	} );
} );
