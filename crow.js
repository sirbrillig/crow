import path from 'path';

class Crow {
	constructor( dir ) {
		this.rootDir = dir;
		this.currentBranchName = null;
	}

	getRootDir() {
		return this.rootDir;
	}

	setCurrentBranch( name ) {
		this.currentBranchName = name;
	}

	getBranchFile() {
		if ( ! this.currentBranchName ) {
			return null;
		}
		return path.join( this.getRootDir(), 'refs', 'heads', this.currentBranchName );
	}
}

export default Crow;

export function getCrowAt( dir ) {
	return new Crow( dir );
}
