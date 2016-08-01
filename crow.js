class Crow {
	constructor( dir ) {
		this.rootDir = dir;
	}

	getRootDir() {
		return this.rootDir;
	}
}

export default Crow;

export function getCrowAt( dir ) {
	return new Crow( dir );
}
