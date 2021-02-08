import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CourseService } from '../../../services/course.service';
import { FeedbackSessionsService } from '../../../services/feedback-sessions.service';
import { SimpleModalService } from '../../../services/simple-modal.service';
import {
  Course, CourseArchive, Courses,
  FeedbackSession,
  FeedbackSessionPublishStatus,
  FeedbackSessions,
  FeedbackSessionSubmissionStatus,
  InstructorPrivilege,
  ResponseVisibleSetting,
  SessionVisibleSetting,
} from '../../../types/api-output';
import { SortBy, SortOrder } from '../../../types/sort-properties';
import { SimpleModalType } from '../../components/simple-modal/simple-modal-type';
import { TeammatesRouterModule } from '../../components/teammates-router/teammates-router.module';
import { CourseTabModel, InstructorHomePageComponent } from './instructor-home-page.component';
import { InstructorHomePageModule } from './instructor-home-page.module';

const instructorPrivilege: InstructorPrivilege = {
  canModifyCourse: true,
  canModifySession: true,
  canModifyStudent: true,
  canSubmitSessionInSections: true,
  canModifyInstructor: false,
  canViewStudentInSections: false,
  canModifySessionCommentsInSections: false,
  canViewSessionInSections: false,
};

const defaultCourse: Course = {
  courseId: 'CS3281',
  courseName: 'Thematic Systems',
  creationTimestamp: 4924740000,
  deletionTimestamp: 0,
  timeZone: 'Asia/Singapore',
};

const feedbackSession: FeedbackSession = {
  courseId: 'CS3281',
  timeZone: 'Asia/Singapore',
  feedbackSessionName: 'Feedback',
  instructions: 'Answer all questions',
  submissionStartTimestamp: 1552390757,
  submissionEndTimestamp: 1552590757,
  gracePeriod: 0,
  sessionVisibleSetting: SessionVisibleSetting.AT_OPEN,
  customSessionVisibleTimestamp: 0,
  responseVisibleSetting: ResponseVisibleSetting.AT_VISIBLE,
  customResponseVisibleTimestamp: 0,
  submissionStatus: FeedbackSessionSubmissionStatus.NOT_VISIBLE,
  publishStatus: FeedbackSessionPublishStatus.NOT_PUBLISHED,
  isClosingEmailEnabled: true,
  isPublishedEmailEnabled: true,
  createdAtTimestamp: 0,
};

const activeCourseTabModels: CourseTabModel[] = [
  {
    course: {
      courseId: 'CS1231',
      courseName: 'Discrete Structures',
      // Saturday, 2 February 2019 16:15:30 GMT+08:00
      creationTimestamp: 1549095330000,
      deletionTimestamp: 0,
      timeZone: 'Asia/Singapore',
    },
    instructorPrivilege: {
      canModifyCourse: true,
      canModifySession: true,
      canModifyStudent: true,
      canSubmitSessionInSections: true,
      canModifyInstructor: false,
      canViewStudentInSections: false,
      canModifySessionCommentsInSections: false,
      canViewSessionInSections: false,
    },
    sessionsTableRowModels: [],
    sessionsTableRowModelsSortBy: SortBy.NONE,
    sessionsTableRowModelsSortOrder: SortOrder.ASC,

    hasPopulated: false,
    isAjaxSuccess: true,
    isTabExpanded: true,
    hasLoadingFailed: false,
  },
  {
    course: {
      courseId: 'CS3281',
      courseName: 'Thematic Systems I',
      // Saturday, 2 February 2019 16:15:30 GMT+08:00
      creationTimestamp: 1549095330000,
      deletionTimestamp: 0,
      timeZone: 'Asia/Singapore',
    },
    instructorPrivilege: {
      canModifyCourse: true,
      canModifySession: true,
      canModifyStudent: true,
      canSubmitSessionInSections: true,
      canModifyInstructor: false,
      canViewStudentInSections: false,
      canModifySessionCommentsInSections: false,
      canViewSessionInSections: false,
    },
    sessionsTableRowModels: [],
    sessionsTableRowModelsSortBy: SortBy.NONE,
    sessionsTableRowModelsSortOrder: SortOrder.ASC,

    hasPopulated: false,
    isAjaxSuccess: true,
    isTabExpanded: true,
    hasLoadingFailed: false,
  },
];

describe('InstructorHomePageComponent', () => {
  let courseService: CourseService;
  let simpleModalService: SimpleModalService;
  let feedbackSessionsService: FeedbackSessionsService;
  let component: InstructorHomePageComponent;
  let fixture: ComponentFixture<InstructorHomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        InstructorHomePageModule,
        HttpClientTestingModule,
        RouterTestingModule,
        TeammatesRouterModule,
        BrowserAnimationsModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorHomePageComponent);
    component = fixture.componentInstance;
    courseService = TestBed.inject(CourseService);
    simpleModalService = TestBed.inject(SimpleModalService);
    feedbackSessionsService = TestBed.inject(FeedbackSessionsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get course candidates', () => {
    component.courseTabModels = activeCourseTabModels;
    fixture.detectChanges();

    const courses: Course[] = component.courseCandidates;

    expect(courses.length).toEqual(2);
    expect(courses[0].courseId).toEqual('CS1231');
    expect(courses[0].courseName).toEqual('Discrete Structures');
  });

  it('should expand the course tab model upon clicking', () => {
    component.courseTabModels = activeCourseTabModels;
    component.hasCoursesLoaded = true;
    fixture.detectChanges();

    const button: any = fixture.debugElement.nativeElement.querySelector('#course-tab-header');
    button.click();
    expect(component.courseTabModels[0].isTabExpanded).toBeFalsy();
    button.click();
    expect(component.courseTabModels[0].isTabExpanded).toBeTruthy();
  });

  it('should archive the entire course from the instructor', () => {
    const courseArchive: CourseArchive = {
      courseId: 'CS1231',
      isArchived: true,
    };

    component.courseTabModels = activeCourseTabModels;
    component.hasCoursesLoaded = true;
    fixture.detectChanges();

    expect(component.courseTabModels.length).toEqual(2);
    expect(component.courseTabModels[0].course.courseId).toEqual('CS1231');
    expect(component.courseTabModels[0].course.courseName).toEqual('Discrete Structures');

    spyOn(simpleModalService, 'openConfirmationModal').and.callFake(() => {
      return {
        componentInstance: {
          header: 'mock header', content: 'mock content', type: SimpleModalType.INFO,
        },
        result: Promise.resolve(),
      };
    });
    spyOn(courseService, 'changeArchiveStatus').and.returnValue(of(courseArchive));

    const courseButton: any = fixture.debugElement.nativeElement.querySelector('#btn-course');
    courseButton.click();
    const archiveButton: any = fixture.debugElement.nativeElement.querySelector('#btn-archive-course');
    archiveButton.click();

    expect(component.courseTabModels.length).toEqual(1);
    expect(component.courseTabModels[0].course.courseId).toEqual('CS3281');
    expect(component.courseTabModels[0].course.courseName).toEqual('Thematic Systems I');
  });

  it('should delete the entire course from the instructor', () => {
    const courseToDelete: Course = {
      courseId: 'CS1231',
      courseName: 'Discrete Structures',
      creationTimestamp: 1549095330000,
      deletionTimestamp: 0,
      timeZone: 'Asia/Singapore',
    };

    component.courseTabModels = activeCourseTabModels;
    component.hasCoursesLoaded = true;
    fixture.detectChanges();

    expect(component.courseTabModels.length).toEqual(2);
    expect(component.courseTabModels[0].course.courseId).toEqual('CS1231');
    expect(component.courseTabModels[0].course.courseName).toEqual('Discrete Structures');

    spyOn(simpleModalService, 'openConfirmationModal').and.callFake(() => {
      return {
        componentInstance: {
          header: 'mock header', content: 'mock content', type: SimpleModalType.WARNING,
        },
        result: Promise.resolve(),
      };
    });
    spyOn(courseService, 'binCourse').and.returnValue(of(courseToDelete));

    const courseButton: any = fixture.debugElement.nativeElement.querySelector('#btn-course');
    courseButton.click();
    const archiveButton: any = fixture.debugElement.nativeElement.querySelector('#btn-delete-course');
    archiveButton.click();

    expect(component.courseTabModels.length).toEqual(1);
    expect(component.courseTabModels[0].course.courseId).toEqual('CS3281');
    expect(component.courseTabModels[0].course.courseName).toEqual('Thematic Systems I');
  });

  it('should load courses of the current instructor', () => {
    const activeCourses: Courses = {
      courses: [
        {
          courseId: 'CS1231',
          courseName: 'Discrete Structures',
          creationTimestamp: 1549095330000,
          deletionTimestamp: 0,
          timeZone: 'Asia/Singapore',
        },
        {
          courseId: 'CS3281',
          courseName: 'Thematic Systems',
          creationTimestamp: 1611580917000,
          deletionTimestamp: 0,
          timeZone: 'Asia/Singapore',
        },
      ],
    };

    spyOn(courseService, 'getInstructorCoursesThatAreActive').and.returnValue(of(activeCourses));
    component.loadCourses();

    expect(component.hasCoursesLoaded).toBeTruthy();
    // panels are sorted in descending order by default
    expect(component.courseTabModels[0].course.courseId).toEqual('CS3281');
    expect(component.courseTabModels[0].course.courseName).toEqual('Thematic Systems');
    expect(component.courseTabModels[1].course.courseId).toEqual('CS1231');
    expect(component.courseTabModels[1].course.courseName).toEqual('Discrete Structures');
    expect(component.courseTabModels.length).toEqual(2);
    expect(component.isNewUser).toBeFalsy();
  });

  it('should load feedbackSessions in the course', () => {
    const courseSessions: FeedbackSessions = {
      feedbackSessions: [
        {
          feedbackSessionName: 'First Session',
          courseId: 'CS1231',
          timeZone: 'Asia/Singapore',
          instructions: '',
          submissionStartTimestamp: 0,
          submissionEndTimestamp: 1610371317000,
          gracePeriod: 0,
          sessionVisibleSetting: SessionVisibleSetting.AT_OPEN,
          responseVisibleSetting: ResponseVisibleSetting.AT_VISIBLE,
          submissionStatus: FeedbackSessionSubmissionStatus.OPEN,
          publishStatus: FeedbackSessionPublishStatus.PUBLISHED,
          isClosingEmailEnabled: true,
          isPublishedEmailEnabled: true,
          createdAtTimestamp: 0,
        },
        {
          feedbackSessionName: 'Second Session',
          courseId: 'CS1231',
          timeZone: 'Asia/Singapore',
          instructions: '',
          submissionStartTimestamp: 0,
          submissionEndTimestamp: 1611148917000,
          gracePeriod: 0,
          sessionVisibleSetting: SessionVisibleSetting.AT_OPEN,
          responseVisibleSetting: ResponseVisibleSetting.AT_VISIBLE,
          submissionStatus: FeedbackSessionSubmissionStatus.OPEN,
          publishStatus: FeedbackSessionPublishStatus.PUBLISHED,
          isClosingEmailEnabled: true,
          isPublishedEmailEnabled: true,
          createdAtTimestamp: 0,
        },
      ],
    };

    spyOn(feedbackSessionsService, 'getFeedbackSessionsForInstructor').and.returnValue(of(courseSessions));
    component.courseTabModels = activeCourseTabModels;
    component.loadFeedbackSessions(0);
    fixture.detectChanges();

    expect(component.courseTabModels[0].hasLoadingFailed).toBeFalsy();
    expect(component.courseTabModels[0].hasPopulated).toBeTruthy();
    expect(component.courseTabModels[0].isAjaxSuccess).toBeTruthy();
    expect(component.courseTabModels[0].sessionsTableRowModels.length).toEqual(2);

    expect(component.courseTabModels[0].sessionsTableRowModels[0]
            .feedbackSession.feedbackSessionName).toEqual('Second Session');
    expect(component.courseTabModels[0].sessionsTableRowModels[1]
            .feedbackSession.feedbackSessionName).toEqual('First Session');
  });

  it('should snap with default fields', () => {
    expect(fixture).toMatchSnapshot();
  });

  it('should snap with one course without feedback session', () => {
    const courseTabModels: any = {
      instructorPrivilege,
      course: {
        courseId: 'CS3243',
        courseName: 'Introduction to AI',
        creationTimestamp: 1546198490630,
        timeZone: 'Asia/Singapore',
      },
      sessionsTableRowModels: [],
      sessionsTableRowModelsSortBy: SortBy.NONE,
      sessionsTableRowModelsSortOrder: SortOrder.ASC,
      hasPopulated: true,
      isAjaxSuccess: true,
      isTabExpanded: true,
    };
    component.hasCoursesLoaded = true;
    component.courseTabModels = [courseTabModels];
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should snap with one course with unpopulated feedback sessions', () => {
    const courseTabModels: any = {
      instructorPrivilege,
      course: defaultCourse,
      sessionsTableRowModels: [],
      sessionsTableRowModelsSortBy: SortBy.NONE,
      sessionsTableRowModelsSortOrder: SortOrder.ASC,
      hasPopulated: false,
      isAjaxSuccess: true,
      isTabExpanded: true,
    };
    component.hasCoursesLoaded = true;
    component.courseTabModels = [courseTabModels];
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should snap with one course with error loading feedback sessions', () => {
    const courseTabModels: any = {
      instructorPrivilege,
      course: defaultCourse,
      sessionsTableRowModels: [],
      sessionsTableRowModelsSortBy: SortBy.NONE,
      sessionsTableRowModelsSortOrder: SortOrder.ASC,
      hasPopulated: false,
      isAjaxSuccess: false,
      isTabExpanded: true,
    };
    component.hasCoursesLoaded = true;
    component.courseTabModels = [courseTabModels];
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should snap with one course with unexpanded course tab', () => {
    const courseTabModels: any = {
      instructorPrivilege,
      course: defaultCourse,
      sessionsTableRowModels: [],
      sessionsTableRowModelsSortBy: SortBy.NONE,
      sessionsTableRowModelsSortOrder: SortOrder.ASC,
      hasPopulated: false,
      isAjaxSuccess: true,
      isTabExpanded: false,
    };
    component.hasCoursesLoaded = true;
    component.courseTabModels = [courseTabModels];
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should snap with one course with one feedback session with instructor privilege', () => {
    const sessionsTableRowModel: any = {
      feedbackSession,
      instructorPrivilege,
      responseRate: '0 / 6',
      isLoadingResponseRate: false,
    };
    const courseTabModels: any = {
      instructorPrivilege,
      course: defaultCourse,
      sessionsTableRowModels: [sessionsTableRowModel],
      sessionsTableRowModelsSortBy: SortBy.NONE,
      sessionsTableRowModelsSortOrder: SortOrder.ASC,
      hasPopulated: true,
      isAjaxSuccess: true,
      isTabExpanded: true,
    };
    component.hasCoursesLoaded = true;
    component.courseTabModels = [courseTabModels];
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should snap with one course with two feedback sessions with tutor privilege', () => {
    const feedbackSession1: any = {
      courseId: 'CS3281',
      timeZone: 'Asia/Singapore',
      feedbackSessionName: 'Feedback 1',
      instructions: 'Answer all questions',
      submissionStartTimestamp: 0,
      submissionEndTimestamp: 1,
      gracePeriod: 0,
      sessionVisibleSetting: SessionVisibleSetting.AT_OPEN,
      customSessionVisibleTimestamp: 0,
      responseVisibleSetting: ResponseVisibleSetting.AT_VISIBLE,
      customResponseVisibleTimestamp: 0,
      submissionStatus: FeedbackSessionSubmissionStatus.CLOSED,
      publishStatus: FeedbackSessionPublishStatus.PUBLISHED,
      isClosingEmailEnabled: true,
      isPublishedEmailEnabled: true,
      createdAtTimestamp: 0,
    };
    const feedbackSession2: any = {
      courseId: 'CS3281',
      timeZone: 'Asia/Singapore',
      feedbackSessionName: 'Feedback 2',
      instructions: 'Answer all questions',
      submissionStartTimestamp: 10000,
      submissionEndTimestamp: 15000,
      gracePeriod: 100,
      sessionVisibleSetting: SessionVisibleSetting.AT_OPEN,
      customSessionVisibleTimestamp: 0,
      responseVisibleSetting: ResponseVisibleSetting.AT_VISIBLE,
      customResponseVisibleTimestamp: 0,
      submissionStatus: FeedbackSessionSubmissionStatus.OPEN,
      publishStatus: FeedbackSessionPublishStatus.NOT_PUBLISHED,
      isClosingEmailEnabled: true,
      isPublishedEmailEnabled: true,
      createdAtTimestamp: 1000,
    };
    const tutorPrivilege: any = {
      canModifyCourse: false,
      canModifySession: false,
      canModifyStudent: false,
      canSubmitSessionInSections: false,
    };
    const sessionsTableRowModel1: any = {
      feedbackSession: feedbackSession1,
      instructorPrivilege: tutorPrivilege,
      responseRate: '0 / 6',
      isLoadingResponseRate: false,
    };
    const sessionsTableRowModel2: any = {
      feedbackSession: feedbackSession2,
      instructorPrivilege: tutorPrivilege,
      responseRate: '5 / 6',
      isLoadingResponseRate: false,
    };
    const courseTabModels: any = {
      instructorPrivilege: tutorPrivilege,
      course: defaultCourse,
      sessionsTableRowModels: [sessionsTableRowModel1, sessionsTableRowModel2],
      sessionsTableRowModelsSortBy: SortBy.COURSE_CREATION_DATE,
      sessionsTableRowModelsSortOrder: SortOrder.ASC,
      hasPopulated: true,
      isAjaxSuccess: true,
      isTabExpanded: true,
    };
    component.hasCoursesLoaded = true;
    component.courseTabModels = [courseTabModels];
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should snap when courses are still loading', () => {
    const courseTabModels: any = {
      instructorPrivilege,
      course: defaultCourse,
      sessionsTableRowModels: [],
      sessionsTableRowModelsSortBy: SortBy.NONE,
      sessionsTableRowModelsSortOrder: SortOrder.ASC,
      hasPopulated: true,
      isAjaxSuccess: true,
      isTabExpanded: true,
    };
    component.hasCoursesLoaded = false;
    component.courseTabModels = [courseTabModels];
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
});
