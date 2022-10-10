#!/bin/bash

STACK=$1

if [ "$STACK" != "test" ] && [ "$STACK" != "prod" ]; then
	echo "Usage: $0 [test|prod]"
	exit 1
fi

CMD="aws cloudformation deploy \
--stack-name sillari-ecs-$STACK \
--template-file ecs.yaml \
--region eu-west-1 \
--profile centralized \
--capabilities CAPABILITY_NAMED_IAM \
--parameter-overrides file://params/$STACK.json"

echo ">> $CMD"
echo
read -n1 -rsp $'Press any key to continue or ^C to abort.\n'
echo
eval $CMD
