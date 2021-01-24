package teammates.ui.webapi;

import teammates.common.util.Const;
import teammates.ui.output.ResponseSubmissionStats;

/**
 * Get the new feedback response submission statistics in the past 12 hours.
 */
public class GetFeedbackResponseSubmissionStatsAction extends AdminOnlyAction {

    @Override
    JsonResult execute() {
        String courseId = getNonNullRequestParamValue(Const.ParamsNames.COURSE_ID);
        String feedbackSessionName = getNonNullRequestParamValue(Const.ParamsNames.FEEDBACK_SESSION_NAME);

        ResponseSubmissionStats output =
                new ResponseSubmissionStats(logic.getRecentResponseSubmissionStats(courseId, feedbackSessionName));

        return new JsonResult(output);
    }
}
