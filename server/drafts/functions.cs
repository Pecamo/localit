//
// Computes the relevance score of a post
//
function float score(int nbVotes, int elapsedTime)
{
	int order = Math.Log10(Math.Max(Math.abs(nbVotes), 1));
	if (nbVotes > 0) {
		int sign = 1;
	} else if (nbVotes < 0) {
		int sign = -1;
	} else {
		int sign = 0;
	}
	return (order + sign * elapsedTime / 45000);
}