import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { ApplicantCount, Application, CreateApplicationRequest, ErrorResponse, Exam, HealthStatus, Job, ListJobsParams, Message, SendMessageRequest, StudyMaterial, UpdateStatusRequest } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List all jobs with optional filters
 */
export declare const getListJobsUrl: (params?: ListJobsParams) => string;
export declare const listJobs: (params?: ListJobsParams, options?: RequestInit) => Promise<Job[]>;
export declare const getListJobsQueryKey: (params?: ListJobsParams) => readonly ["/api/jobs", ...ListJobsParams[]];
export declare const getListJobsQueryOptions: <TData = Awaited<ReturnType<typeof listJobs>>, TError = ErrorType<unknown>>(params?: ListJobsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listJobs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listJobs>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListJobsQueryResult = NonNullable<Awaited<ReturnType<typeof listJobs>>>;
export type ListJobsQueryError = ErrorType<unknown>;
/**
 * @summary List all jobs with optional filters
 */
export declare function useListJobs<TData = Awaited<ReturnType<typeof listJobs>>, TError = ErrorType<unknown>>(params?: ListJobsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listJobs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get a single job by ID
 */
export declare const getGetJobUrl: (id: number) => string;
export declare const getJob: (id: number, options?: RequestInit) => Promise<Job>;
export declare const getGetJobQueryKey: (id: number) => readonly [`/api/jobs/${number}`];
export declare const getGetJobQueryOptions: <TData = Awaited<ReturnType<typeof getJob>>, TError = ErrorType<ErrorResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getJob>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getJob>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetJobQueryResult = NonNullable<Awaited<ReturnType<typeof getJob>>>;
export type GetJobQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Get a single job by ID
 */
export declare function useGetJob<TData = Awaited<ReturnType<typeof getJob>>, TError = ErrorType<ErrorResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getJob>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get all applications for the current session user
 */
export declare const getListApplicationsUrl: () => string;
export declare const listApplications: (options?: RequestInit) => Promise<Application[]>;
export declare const getListApplicationsQueryKey: () => readonly ["/api/applications"];
export declare const getListApplicationsQueryOptions: <TData = Awaited<ReturnType<typeof listApplications>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listApplications>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listApplications>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListApplicationsQueryResult = NonNullable<Awaited<ReturnType<typeof listApplications>>>;
export type ListApplicationsQueryError = ErrorType<unknown>;
/**
 * @summary Get all applications for the current session user
 */
export declare function useListApplications<TData = Awaited<ReturnType<typeof listApplications>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listApplications>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Apply for a job
 */
export declare const getCreateApplicationUrl: () => string;
export declare const createApplication: (createApplicationRequest: CreateApplicationRequest, options?: RequestInit) => Promise<Application>;
export declare const getCreateApplicationMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createApplication>>, TError, {
        data: BodyType<CreateApplicationRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createApplication>>, TError, {
    data: BodyType<CreateApplicationRequest>;
}, TContext>;
export type CreateApplicationMutationResult = NonNullable<Awaited<ReturnType<typeof createApplication>>>;
export type CreateApplicationMutationBody = BodyType<CreateApplicationRequest>;
export type CreateApplicationMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Apply for a job
 */
export declare const useCreateApplication: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createApplication>>, TError, {
        data: BodyType<CreateApplicationRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createApplication>>, TError, {
    data: BodyType<CreateApplicationRequest>;
}, TContext>;
/**
 * @summary Update application status (simulate ATS progression)
 */
export declare const getUpdateApplicationStatusUrl: (id: number) => string;
export declare const updateApplicationStatus: (id: number, updateStatusRequest: UpdateStatusRequest, options?: RequestInit) => Promise<Application>;
export declare const getUpdateApplicationStatusMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateApplicationStatus>>, TError, {
        id: number;
        data: BodyType<UpdateStatusRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateApplicationStatus>>, TError, {
    id: number;
    data: BodyType<UpdateStatusRequest>;
}, TContext>;
export type UpdateApplicationStatusMutationResult = NonNullable<Awaited<ReturnType<typeof updateApplicationStatus>>>;
export type UpdateApplicationStatusMutationBody = BodyType<UpdateStatusRequest>;
export type UpdateApplicationStatusMutationError = ErrorType<unknown>;
/**
 * @summary Update application status (simulate ATS progression)
 */
export declare const useUpdateApplicationStatus: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateApplicationStatus>>, TError, {
        id: number;
        data: BodyType<UpdateStatusRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateApplicationStatus>>, TError, {
    id: number;
    data: BodyType<UpdateStatusRequest>;
}, TContext>;
/**
 * @summary Get total applicant count for a job
 */
export declare const getGetJobApplicantCountUrl: (id: number) => string;
export declare const getJobApplicantCount: (id: number, options?: RequestInit) => Promise<ApplicantCount>;
export declare const getGetJobApplicantCountQueryKey: (id: number) => readonly [`/api/jobs/${number}/applicant-count`];
export declare const getGetJobApplicantCountQueryOptions: <TData = Awaited<ReturnType<typeof getJobApplicantCount>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getJobApplicantCount>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getJobApplicantCount>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetJobApplicantCountQueryResult = NonNullable<Awaited<ReturnType<typeof getJobApplicantCount>>>;
export type GetJobApplicantCountQueryError = ErrorType<unknown>;
/**
 * @summary Get total applicant count for a job
 */
export declare function useGetJobApplicantCount<TData = Awaited<ReturnType<typeof getJobApplicantCount>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getJobApplicantCount>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List all messages for the session user
 */
export declare const getListMessagesUrl: () => string;
export declare const listMessages: (options?: RequestInit) => Promise<Message[]>;
export declare const getListMessagesQueryKey: () => readonly ["/api/messages"];
export declare const getListMessagesQueryOptions: <TData = Awaited<ReturnType<typeof listMessages>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMessages>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listMessages>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListMessagesQueryResult = NonNullable<Awaited<ReturnType<typeof listMessages>>>;
export type ListMessagesQueryError = ErrorType<unknown>;
/**
 * @summary List all messages for the session user
 */
export declare function useListMessages<TData = Awaited<ReturnType<typeof listMessages>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMessages>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Send a message to HR (simulates email)
 */
export declare const getSendMessageUrl: () => string;
export declare const sendMessage: (sendMessageRequest: SendMessageRequest, options?: RequestInit) => Promise<Message>;
export declare const getSendMessageMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendMessage>>, TError, {
        data: BodyType<SendMessageRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof sendMessage>>, TError, {
    data: BodyType<SendMessageRequest>;
}, TContext>;
export type SendMessageMutationResult = NonNullable<Awaited<ReturnType<typeof sendMessage>>>;
export type SendMessageMutationBody = BodyType<SendMessageRequest>;
export type SendMessageMutationError = ErrorType<unknown>;
/**
 * @summary Send a message to HR (simulates email)
 */
export declare const useSendMessage: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendMessage>>, TError, {
        data: BodyType<SendMessageRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof sendMessage>>, TError, {
    data: BodyType<SendMessageRequest>;
}, TContext>;
/**
 * @summary List all PG-CET exam resources
 */
export declare const getListExamsUrl: () => string;
export declare const listExams: (options?: RequestInit) => Promise<Exam[]>;
export declare const getListExamsQueryKey: () => readonly ["/api/exams"];
export declare const getListExamsQueryOptions: <TData = Awaited<ReturnType<typeof listExams>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listExams>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listExams>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListExamsQueryResult = NonNullable<Awaited<ReturnType<typeof listExams>>>;
export type ListExamsQueryError = ErrorType<unknown>;
/**
 * @summary List all PG-CET exam resources
 */
export declare function useListExams<TData = Awaited<ReturnType<typeof listExams>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listExams>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get a single exam resource by ID
 */
export declare const getGetExamUrl: (id: number) => string;
export declare const getExam: (id: number, options?: RequestInit) => Promise<Exam>;
export declare const getGetExamQueryKey: (id: number) => readonly [`/api/exams/${number}`];
export declare const getGetExamQueryOptions: <TData = Awaited<ReturnType<typeof getExam>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getExam>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getExam>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetExamQueryResult = NonNullable<Awaited<ReturnType<typeof getExam>>>;
export type GetExamQueryError = ErrorType<unknown>;
/**
 * @summary Get a single exam resource by ID
 */
export declare function useGetExam<TData = Awaited<ReturnType<typeof getExam>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getExam>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List all study materials for PG-CET
 */
export declare const getListStudyMaterialsUrl: () => string;
export declare const listStudyMaterials: (options?: RequestInit) => Promise<StudyMaterial[]>;
export declare const getListStudyMaterialsQueryKey: () => readonly ["/api/study-materials"];
export declare const getListStudyMaterialsQueryOptions: <TData = Awaited<ReturnType<typeof listStudyMaterials>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listStudyMaterials>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listStudyMaterials>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListStudyMaterialsQueryResult = NonNullable<Awaited<ReturnType<typeof listStudyMaterials>>>;
export type ListStudyMaterialsQueryError = ErrorType<unknown>;
/**
 * @summary List all study materials for PG-CET
 */
export declare function useListStudyMaterials<TData = Awaited<ReturnType<typeof listStudyMaterials>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listStudyMaterials>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map