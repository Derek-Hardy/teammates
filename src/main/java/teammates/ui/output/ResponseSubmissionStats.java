package teammates.ui.output;

import java.util.List;

/**
 * The API output format of new response submission statistics for a particular session.
 */
public class ResponseSubmissionStats extends ApiOutput {
    private final List<Integer> data;

    public ResponseSubmissionStats(List<Integer> data) {
        this.data = data;
    }

    public List<Integer> getData() {
        return data;
    }
}
