import graphene
import graphql_jwt
from apps.companies.schema import Query as CompanyQuery
from apps.companies.schema import Mutation as CompanyMutation

class Query(CompanyQuery, graphene.ObjectType):
    pass

class Mutation(CompanyMutation, graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()

schema = graphene.Schema(query=Query, mutation=Mutation) 