package teammates.ui.output;

import java.util.List;

/**
 * The API output format of new response submission statistics for a particular session.
 */
public class ResponseSubmissionStats extends ApiOutput {
    private final List<String> data;

    public ResponseSubmissionStats(List<String> data) {
        this.data = data;
    }

    public List<String> getData() {
        return data;
    }
}
