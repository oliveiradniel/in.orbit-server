import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

interface RequestWithUserId extends Request {
  userId: string;
}

export const ActiveUserId = createParamDecorator(
  (_, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<RequestWithUserId>();

    const userId = request.userId;

    if (!userId) {
      throw new UnauthorizedException();
    }

    return userId;
  },
);
