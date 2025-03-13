import { z } from 'zod'

export type RegisterSchemaType = z.infer<typeof registerSchema> // 타입 추론 자동

export const registerSchema = z
    .object({
        email: z.string().nonempty('이메일을 입력해주세요.').email('이메일 형식을 입력해주세요.'),
        userId: z
            .string()
            .nonempty('아이디를 입력해주세요.')
            .regex(/^[a-z0-9]{4,30}$/, '영문 소문자 또는 영문+숫자 조합 4~30자리를 입력해주세요.'),
        password: z
            .string()
            .nonempty('비밀번호를 입력해주세요.')
            .regex(
                /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/,
                '영문+숫자+특수문자(! @ # $ % & * ?) 조합 8~15자리를 입력해주세요.',
            ),
        passwordCheck: z.string().nonempty('비밀번호를 다시 입력해주세요.'),
        nickname: z
            .string()
            .nonempty('닉네임을 입력해주세요.')
            .regex(/^[a-z]{0,5}$/, '닉네임은 5글자까지 가능합니다.')
            .optional(),
        agree: z.string(),
    })
    .refine((data) => data.password === data.passwordCheck, {
        path: ['passwordCheck'],
        message: '비밀번호가 일치하지 않습니다.',
    })
