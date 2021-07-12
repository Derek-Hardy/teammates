import { Component, OnInit } from '@angular/core';
import moment from 'moment-timezone';
import { finalize } from 'rxjs/operators';
import { FeedbackSessionsService } from '../../../services/feedback-sessions.service';
import { StatusMessageService } from '../../../services/status-message.service';
import { TimezoneService } from '../../../services/timezone.service';
import {
  OngoingSession,
  OngoingSessions,
  ResponseSubmissionStats } from '../../../types/api-output';
import { collapseAnim } from '../../components/teammates-common/collapse-anim';
import { ErrorMessageOutput } from '../../error-message-output';

/**
 * Admin dashboard page.
 */
@Component({
  selector: 'tm-admin-dashboard-page',
  templateUrl: './admin-dashboard-page.component.html',
  styleUrls: ['./admin-dashboard-page.component.scss'],
  animations: [collapseAnim],
})
export class AdminDashboardPageComponent implements OnInit {

  totalOngoingSessions: number = 0;
  sessions: Record<string, OngoingSession[]> = {};
  stats: any[] = [];

  // Tracks the whether the panel of an institute has been opened
  institutionPanelsStatus: Record<string, boolean> = {};

  showFilter: boolean = true;
  timezones: string[] = [];
  filterTimezone: string = '';
  tableTimezone: string = '';
  startDate: any = {};
  startTime: any = {};
  endDate: any = {};
  endTime: any = {};

  isLoadingOngoingSessions: boolean = false;

  constructor(private timezoneService: TimezoneService,
              private statusMessageService: StatusMessageService,
              private feedbackSessionsService: FeedbackSessionsService) {}

  ngOnInit(): void {
    this.timezones = Object.keys(this.timezoneService.getTzOffsets());
    this.filterTimezone = this.timezoneService.guessTimezone();
    this.tableTimezone = this.timezoneService.guessTimezone();

    const now: any = moment();
    this.startDate = {
      year: now.year(),
      month: now.month() + 1,
      day: now.date(),
    };
    this.startTime = {
      hour: now.hour(),
      minute: now.minute(),
    };
    this.endTime = {
      hour: now.hour(),
      minute: now.minute(),
    };

    const nextWeek: any = moment(now).add(1, 'weeks');
    this.endDate = {
      year: nextWeek.year(),
      month: nextWeek.month() + 1,
      day: nextWeek.date(),
    };

    this.getFeedbackSessions();
  }

  /**
   * Gets the feedback sessions which have opening time satisfying the query range.
   */
  getFeedbackSessions(): void {
    const startTime: any = this.getMomentInstant(this.startDate.year, this.startDate.month - 1,
        this.startDate.day, this.startTime.hour, this.startTime.minute);
    const endTime: any = this.getMomentInstant(this.endDate.year, this.endDate.month - 1,
        this.endDate.day, this.endTime.hour, this.endTime.minute);

    this.isLoadingOngoingSessions = true;

    this.feedbackSessionsService.getOngoingSessions(startTime.toDate().getTime(), endTime.toDate().getTime())
        .pipe(finalize(() => this.isLoadingOngoingSessions = false))
        .subscribe((resp: OngoingSessions) => {
          this.totalOngoingSessions = resp.totalOngoingSessions;
          Object.keys(resp.sessions).forEach((key: string) => {
            this.sessions[key] = resp.sessions[key];
            for (const fs of this.sessions[key]) {
              this.feedbackSessionsService.getRecentResponseSubmissionStats(fs.courseId, fs.feedbackSessionName)
                  .subscribe((rss: ResponseSubmissionStats) => {
                    for (const stat of rss.data) {
                      const res: string[] = stat.split('%');
                      this.stats.push({ time: res[0], total: res[1] });
                    }
                  }, (error: ErrorMessageOutput) => {
                    this.statusMessageService.showErrorToast(error.error.message);
                  });
            }
          });

          this.institutionPanelsStatus = {};
          for (const institution of Object.keys(resp.sessions)) {
            this.institutionPanelsStatus[institution] = true;
          }
        }, (resp: ErrorMessageOutput) => {
          this.statusMessageService.showErrorToast(resp.error.message);
        });
  }

  /**
   * Converts milliseconds to readable date format.
   */
  showDateFromMillis(millis: number): string {
    return this.timezoneService.formatToString(millis, this.tableTimezone, 'ddd, DD MMM YYYY, hh:mm a');
  }

  private getMomentInstant(year: number, month: number, day: number, hour: number, minute: number): any {
    const inst: any = this.timezoneService.getMomentInstance(null, this.filterTimezone);
    inst.set('year', year);
    inst.set('month', month);
    inst.set('date', day);
    inst.set('hour', hour);
    inst.set('minute', minute);
    return inst;
  }

  /**
   * Opens all institution panels.
   */
  openAllInstitutions(): void {
    for (const institution of Object.keys(this.institutionPanelsStatus)) {
      this.institutionPanelsStatus[institution] = true;
    }
  }

  /**
   * Closes all institution panels.
   */
  closeAllInstitutions(): void {
    for (const institution of Object.keys(this.institutionPanelsStatus)) {
      this.institutionPanelsStatus[institution] = false;
    }
  }
}