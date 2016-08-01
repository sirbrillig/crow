import path from 'path';
import fs from 'fs';

class Crow {
	constructor( dir, fsModule ) {
		this.rootDir = dir;
		this.currentBranchName = null;
		this.fs = fsModule;
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

	getBranchFile() {
		if ( ! this.currentBranchName ) {
			return null;
		}
		return path.join( this.getRootDir(), 'refs', 'heads', this.currentBranchName );
	}

	getCurrentBranchHead() {
		const file = this.getBranchFile();
		if ( ! file ) {
			return null;
		}
		try {
			this.fs.accessSync( file );
		} catch ( e ) {
			return null;
		}
		return this.fs.readFileSync( file, 'utf8' );
	}
}

export default Crow;

export function getCrowAt( dir ) {
	return new Crow( dir, fs );
}
