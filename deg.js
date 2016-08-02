import path from 'path';
import fs from 'fs';

import FileManager from './lib/file-manager';

class Deg {
	constructor( dir, options = {} ) {
		this.rootDir = dir;
		this.files = new FileManager( { fs: options.fs || fs } );
	}

	getRootDir() {
		return this.rootDir;
	}

	getHeadFile() {
		return path.join( this.getRootDir(), 'HEAD' );
	}

	setCurrentBranch( name ) {
		this.files.writeFile( this.getHeadFile(), name );
	}

	getCurrentBranch() {
		if ( ! this.files.doesFileExist( this.getHeadFile() ) ) {
			return null;
		}
		return this.files.getFileContents( this.getHeadFile() );
	}

	getBranchFile( name ) {
		const currentBranchName = this.getCurrentBranch();
		if ( ! name && ! currentBranchName ) {
			return null;
		}
		return path.join( this.getRootDir(), 'refs', 'heads', name || currentBranchName );
	}

	getCurrentBranchHead() {
		const file = this.getBranchFile();
		if ( ! this.files.doesDirExist( this.getRootDir() ) ) {
			throw new Error( 'Could not find root directory' );
		}
		if ( ! file || ! this.files.doesFileExist( file ) ) {
			return null;
		}
		const commitId = this.files.getFileContents( file );
		return commitId === '' ? null : commitId;
	}

	createNewBranch( name ) {
		const file = this.getBranchFile( name );
		if ( ! file ) {
			return null;
		}
		if ( this.files.doesFileExist( file ) ) {
			throw new Error( 'Branch already exists' );
		}
		this.files.writeFile( file );
	}
}

export default Deg;

export function getDegAt( dir, options = {} ) {
	return new Deg( dir, options );
}
