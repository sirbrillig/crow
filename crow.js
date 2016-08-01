import path from 'path';
import fs from 'fs';

import FileManager from './lib/file-manager';

class Crow {
	constructor( dir, options = {} ) {
		this.rootDir = dir;
		this.currentBranchName = null;
		this.files = new FileManager( { fs: options.fs || fs } );
	}

	getRootDir() {
		return this.rootDir;
	}

	setCurrentBranch( name ) {
		this.currentBranchName = name;
	}

	getCurrentBranch() {
		return this.currentBranchName;
	}

	getBranchFile( name ) {
		if ( ! name && ! this.currentBranchName ) {
			return null;
		}
		return path.join( this.getRootDir(), 'refs', 'heads', name || this.currentBranchName );
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

export default Crow;

export function getCrowAt( dir, options = {} ) {
	return new Crow( dir, options );
}
